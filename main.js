import prediction from "./data.js";

const conditionToAdd = {
  type: 'condition',
  prediction_id: "placeHolderId",
  confidence: 1,
  manuallyAdded: true,
};

const tooltipDiv = document.getElementById("tooltipDiv");
const addConditionButton = document.getElementById("addConditionButton");
const conditionInput = document.getElementById("conditionInput");
const toothInput = document.getElementById("toothInput");

const [width, height] = [600, 600];
const toothButtonRadius = 20;

const controlsVisibility = {
  bl: false,
  br: false,
  mb: false,
  ml: false,
  mr: false,
  mt: false,
  tl: false,
  tr: false,
  mtr: false,
  saveCondition: false,
}

const crossImg = document.createElement('img');
crossImg.src = './img/cross-mark.png';
const checkImg = document.createElement('img');
checkImg.src = './img/check.png';

let imgWidth = 1;
let imgHeight = 1;

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let currentlyDraggedRect = null;
let isAddingCondition = false;


const fCanvas = new fabric.Canvas('canvas', {selection: false});
let xrayImage = null;
fCanvas.setHeight(height);
fCanvas.setWidth(width);

// events
fCanvas.on('mouse:wheel', function(opt) {
  var delta = opt.e.deltaY;
  var zoom = fCanvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  fCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});

fCanvas.on('mouse:down', (event) => {
  const mousePointer = fCanvas.getPointer(event.e);
  if(!isAddingCondition) return;
  isDragging = true;
  dragStartX = mousePointer.x;
  dragStartY = mousePointer.y;
  currentlyDraggedRect = new fabric.Rect({ 
    width: 0, 
    height: 0, 
    left: dragStartX, 
    top: dragStartY, 
    originX: 'left',
    originY: 'top',
    // strokeDashArray: [5, 5],
    fill: 'transparent',
    hasBorders: false,
    stroke: 'blue',
  });
  fCanvas.add(currentlyDraggedRect);
  
});

// this will keep moving parent div of tooltip with mouse
fCanvas.on('mouse:move', (event) => {
  tooltipDiv.style.top = event.e.clientY + 20 + "px";
  tooltipDiv.style.left = event.e.clientX - 20 + "px";

  if(isDragging && currentlyDraggedRect) {
    const pointer = fCanvas.getPointer(event.e);

    if(dragStartX > pointer.x){
      currentlyDraggedRect.set({ left: Math.abs(pointer.x) });
    }
    if(dragStartY > pointer.y){
      currentlyDraggedRect.set({ top: Math.abs(pointer.y) });
    }

    currentlyDraggedRect.set({ width: Math.abs(dragStartX - pointer.x) });
    currentlyDraggedRect.set({ height: Math.abs(dragStartY - pointer.y) });
    fCanvas.renderAll();
  }
});

fCanvas.on('mouse:up', (event) => {
  if(!isDragging) return;
  isDragging = false;
  const width = currentlyDraggedRect.width;
  const height = currentlyDraggedRect.height;
  if(width < 5 || height < 5){
    // rect is too small deleting it
    return fCanvas.remove(currentlyDraggedRect);
  }
  cancelAddCondition();
  currentlyDraggedRect.setControlsVisibility({mtr: false, saveCondition: true});
  fCanvas.setActiveObject(currentlyDraggedRect);
  fCanvas.renderAll();
});


// if we hover over condition show tooltip
fCanvas.on('mouse:over', (event) => {
  const { target } = event;
  if(!target?.metadata) return
  if(target.metadata.type==="condition"){
    tooltipDiv.innerHTML=`
      <div class="tooltip">${target.metadata.label}</div>
    `
  }
});

// if we hove out of condition remove tooltip
fCanvas.on('mouse:out', (event) => {
    tooltipDiv.querySelectorAll('.tooltip').forEach(e => e.remove());
});

fCanvas.on('selection:created', (event) => {
  updateSelection(event);
});

fCanvas.on('selection:cleared', (event) => {
  updateSelection(event);
});

fCanvas.on('selection:updated', (event) => {
  updateSelection(event);
});

const updateSelection = (event) => {
  event.selected?.forEach(item=>{
    if(item?.metadata?.type==="tooth"){
      showAlert("Tooth:" + item.metadata.label);
      item._objects.forEach(object=>{
        if(!object.text) object.set('fill', '#e3ff00');
      })
    } else if(item?.metadata?.type==="condition"){
      showAlert("Condition:" + item.metadata.label);
      item.set('stroke', '#e3ff00');
    }
  })

  event.deselected?.forEach(item=>{
    if(item?.metadata?.type==="tooth"){
      item._objects.forEach(object=>{
        if(!object.text) object.set('fill', 'white');
      })
    } else if(item?.metadata?.type==="condition"){
      item.set('stroke', 'red');
    }
  })
}

// events end

// delete control
const deleteObject = (eventData, transform) => {
  const target = transform.target;
  if(target?.metadata?.type === "condition"){
    showAlert(
      `condition with prediction id ${target.metadata.prediction_id} had been deleted`,
      "alert-warn"
    );
  }
  fCanvas.remove(target);
  tooltipDiv.querySelectorAll('.tooltip').forEach(e => e.remove()); // remove tooltip if any
}

const saveCondition = (eventData, transform) => {
  

  const condition = {...conditionToAdd};
  if((!conditionInput.value || !toothInput.value) && !isAddingCondition) {
    return showAlert("Please add Condition and Tooth", "alert-warn");
  }

  condition.label = conditionInput.value;
  condition.tooth = toothInput.value;

  const target = transform.target;
  const {top, left, width, height} = target;
  const yMin = (top - xrayImage.top) / imgHeight;
  const xMin = (left - xrayImage.left) / imgWidth;
  const xMax = (width / imgWidth) + xMin;
  const yMax = (height / imgHeight) + yMin;
  condition.box = [xMin, xMax, yMin, yMax];

  console.log(JSON.stringify(condition));
  fCanvas.remove(target);
  addBox(condition)
}

const renderIcon = (icon) => {
  return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size/2, -size/2, size, size);
    ctx.restore();
  }
}

fabric.Object.prototype.controls.delete = new fabric.Control({
  x: 0.5,
  y: -0.5,
  cursorStyle: 'pointer',
  mouseUpHandler: deleteObject,
  render: renderIcon(crossImg),
  cornerSize: 24
});

fabric.Object.prototype.controls.saveCondition = new fabric.Control({
  x: 0,
  y: 0.5,
  offsetY: 24,
  cursorStyle: 'pointer',
  mouseUpHandler: saveCondition,
  render: renderIcon(checkImg),
  cornerSize: 24
});

// delete control end

fabric.Image.fromURL('img/test2.jpeg', (fImg) => {
  xrayImage = fImg;
  fImg.scaleToHeight(height);
  fImg.scaleToWidth(width);
  fImg.selectable = false;
  fImg.erasable = false;
  fImg.hoverCursor = "default",
  imgWidth = fImg.getScaledWidth(),
  imgHeight = fImg.getScaledHeight(),
  fCanvas.centerObject(fImg);
  fCanvas.add(fImg);
  fCanvas.sendToBack(fImg);
  

  // adding predictions on image
  prediction.conditions.forEach(condition => {
    addBox(condition);
  });

  prediction.tooth.forEach(tooth => {
    addTooth(tooth);
  });
});

const showAlert = (text, classes = "") => {
  const alertDiv = document.getElementById("alert");
  alertDiv.innerHTML = `
    <div class="alert ${classes}">
      ${text}
    </div>
  `;
}

const addBox = (condition, color=null) => {
  // convert box to fabric
  const [xMin, xMax, yMin, yMax] = condition.box;
  const boxWidth = (xMax - xMin) * imgWidth;
  const boxHeight = (yMax - yMin) * imgHeight;
  const rect = new fabric.Rect({
    top: (yMin * imgHeight ) + xrayImage.top,
    left: (xMin * imgWidth) + xrayImage.left,
    width: boxWidth,
    height: boxHeight,
    stroke: color || 'red',
    fill: 'transparent',
    hoverCursor: "pointer",
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true,
    metadata: condition,
  });

  rect.setControlsVisibility(controlsVisibility);
  fCanvas.add(rect);
}

const addTooth = (tooth) => {
  const [xMin, xMax, yMin, yMax] = tooth.box;
  const left = (xMin + xMax) * imgWidth / 2;
  const top = (yMin + yMax) * imgHeight / 2;

  const circle = new fabric.Circle({
    top: top - toothButtonRadius + xrayImage.top,
    left: left - toothButtonRadius + xrayImage.left,
    radius: toothButtonRadius,
    stroke: 'black',
    fill: 'white',
  });

  const label = new fabric.Text(tooth.label, {
    top: top + xrayImage.top,
    left: left + xrayImage.left,
    fontSize: 15,
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
  });

  const toothGroup = new fabric.Group([circle, label], {
    hoverCursor: "pointer",
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true,
    metadata: tooth,
  });
  toothGroup.setControlsVisibility({...controlsVisibility, delete: false});
  fCanvas.add(toothGroup);
}


// ui
window.addCondition = (value = null) => {
  if(value !== null){
    isAddingCondition = value;
  } else {
    isAddingCondition = !isAddingCondition;
  }
  if(isAddingCondition) {
    addConditionButton.style.background = "green";
    addConditionButton.style.color = "white";
  } else {
    addConditionButton.style.background = "white";
    addConditionButton.style.color = "black";
  }
}

const cancelAddCondition = () => {
  addCondition(false);
}




import prediction from "./data.js";

const [width, height] = [600, 600];
const toothButtonRadius = 20;
let imgWidth = 1;
let imgHeight = 1;
const fCanvas = new fabric.Canvas('canvas');
let xrayImage = null;
fCanvas.setHeight(height);
fCanvas.setWidth(width);

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

fCanvas.on('mouse:down', function(event) {
  const { target } = event;
  if(!target.metadata) return
  if(target.metadata.type==="tooth"){
    showAlert("Tooth:" + target.metadata.label);
  }
  if(target.metadata.type==="condition"){
    showAlert("Condition:" + target.metadata.label);
  }
   
});

fabric.Image.fromURL('img/test2.jpeg', (fImg) => {
  xrayImage = fImg;
  fImg.scaleToHeight(height);
  fImg.scaleToWidth(width);
  fImg.selectable = false;
  fImg.erasable = false;
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

const showAlert = (text) => {
  const alertDiv = document.getElementById("alert");
  alertDiv.innerHTML = `
    <div class="alert">
      ${text}
    </div>
  `;
}

const addRect = (config) => {
  const rect = new fabric.Rect(config);
  fCanvas.add(rect);
}

const addCircle = (config) => {
  const circle = new fabric.Circle(config);
  fCanvas.add(circle);
}

const addBox = (condition, color=null) => {
  // convert box to fabric
  const [xMin, xMax, yMin, yMax] = condition.box;
  const boxWidth = (xMax - xMin) * imgWidth;
  const boxHeight = (yMax - yMin) * imgHeight;
  addRect({
    top: (yMin * imgHeight ) + xrayImage.top,
    left: (xMin * imgWidth) + xrayImage.left,
    width: boxWidth,
    height: boxHeight,
    stroke: color || 'red',
    fill: 'transparent',
    metadata: condition
  })
}

const addTooth = (tooth) => {
  const [xMin, xMax, yMin, yMax] = tooth.box;
  const left = (xMin + xMax) * imgWidth / 2;
  const top = (yMin + yMax) * imgHeight / 2;
  addCircle({
    top: top - toothButtonRadius + xrayImage.top,
    left: left - toothButtonRadius + xrayImage.left,
    radius: toothButtonRadius,
    stroke: 'black',
    fill: 'white',
    metadata: tooth
  })
}





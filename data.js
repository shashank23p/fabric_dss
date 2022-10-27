const prediction = {
    tooth: [
        {
          label: 'H',
          box: [
            0.07151750972762647, 0.2254863813229572, 0.2573200992555831,
            0.8114143920595533,
          ],
          type: 'tooth',
          prediction_id: "22111",
          confidence: 0.512832629247111,
        },
        {
          label: 'G',
          box: [
            0.23151750972762647, 0.3754863813229572, 0.3573200992555831,
            0.8114143920595533,
          ],
          type: 'tooth',
          prediction_id: "22",
          confidence: 0.512832629247111,
        },
        {
          label: 'F',
          box: [
            0.3618677042801556, 0.5214007782101168, 0.4838709677419355,
            0.8684863523573201,
          ],
          type: 'tooth',
          prediction_id: "23",
          confidence: 0.512832629247111,
        },
        {
          label: 'E',
          box: [
            0.5214007782101168, 0.6828793774319066, 0.4863523573200992,
            0.8784119106699751,
          ],
          type: 'tooth',
          prediction_id: "24",
          confidence: 0.512832629247111,
        },
        {
          label: 'D',
          box: [
            0.669260700389105, 0.8132295719844358, 0.4516129032258064,
            0.8337468982630273,
          ],
          type: 'tooth',
          prediction_id: "25",
          confidence: 0.512832629247111,
        },
        {
          label: 'C',
          box: [
            0.839260700389105, 0.9232295719844358, 0.3116129032258064,
            0.7337468982630273,
          ],
          type: 'tooth',
          prediction_id: "255555",
          confidence: 0.512832629247111,
        },
      ],
      conditions: [
        {
          label: 'Decay',
          tooth: 'H',
          box: [
            0.12151750972762647, 0.2554863813229572, 0.5973200992555831,
            0.714143920595533,
          ],
          type: 'condition',
          prediction_id: "22a",
          confidence: 0.663609595,
        },
        {
          label: 'Possible Pulpotomy',
          tooth: 'G',
          box: [
            0.24151750972762647, 0.3654863813229572, 0.6973200992555831,
            0.8114143920595533,
          ],
          type: 'condition',
          prediction_id: "22b",
          confidence: 0.893609595,
        },
        {
          label: 'Possible Pulpectomy',
          tooth: 'F',
          box: [
            0.3818677042801556, 0.5214007782101168, 0.7438709677419355,
            0.8784863523573201,
          ],
          type: 'condition',
          prediction_id: "23c",
          confidence: 0.883609595,
        },
        {
          label: 'Possible Pulpectomy',
          tooth: 'E',
          box: [
            0.5314007782101168, 0.6728793774319066, 0.7363523573200992,
            0.8884119106699751,
          ],
          type: 'condition',
          prediction_id: "24d",
          confidence: 0.923609595,
        },
        {
          label: 'Possible Pulpectomy',
          tooth: 'D',
          box: [
            0.689260700389105, 0.8032295719844358, 0.6916129032258064,
            0.8337468982630273,
          ],
          type: 'condition',
          prediction_id: "25e",
          confidence: 0.913609595,
        },
        {
          label: 'Decay',
          tooth: 'C',
          box: [
            0.839260700389105, 0.9232295719844358, 0.5916129032258064,
            0.7337468982630273,
          ],
          type: 'condition',
          prediction_id: "25f",
          confidence: 0.943609595,
        },
      ],
}

export default prediction;
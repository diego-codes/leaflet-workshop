const data = {
  "variables": {
    "B08301_001E": {
      "label": "Estimate!!Total",
      "concept": "MEANS OF TRANSPORTATION TO WORK",
      "predicateType": "int",
      "group": "B08301",
      "limit": 0,
      "predicateOnly": true
    },
    "B08301_010E": {
      "label": "Estimate!!Total!!Public transportation (excluding taxicab)",
      "concept": "MEANS OF TRANSPORTATION TO WORK",
      "predicateType": "int",
      "group": "B08301",
      "limit": 0,
      "predicateOnly": true
    },
    "B08301_003E": {
      "label": "Estimate!!Total!!Car, truck, or van!!Drove alone",
      "concept": "MEANS OF TRANSPORTATION TO WORK",
      "predicateType": "int",
      "group": "B08301",
      "limit": 0,
      "predicateOnly": true
    },
    "B08301_002E": {
      "label": "Estimate!!Total!!Car, truck, or van",
      "concept": "MEANS OF TRANSPORTATION TO WORK",
      "predicateType": "int",
      "group": "B08301",
      "limit": 0,
      "predicateOnly": true
    },
    "B08301_018E": {
      "label": "Estimate!!Total!!Bicycle",
      "concept": "MEANS OF TRANSPORTATION TO WORK",
      "predicateType": "int",
      "group": "B08301",
      "limit": 0,
      "predicateOnly": true
    },
    "B08301_019E": {
      "label": "Estimate!!Total!!Walked",
      "concept": "MEANS OF TRANSPORTATION TO WORK",
      "predicateType": "int",
      "group": "B08301",
      "limit": 0,
      "predicateOnly": true
    },
    "B08301_016E": {
      "label": "Estimate!!Total!!Taxicab",
      "concept": "MEANS OF TRANSPORTATION TO WORK",
      "predicateType": "int",
      "group": "B08301",
      "limit": 0,
      "predicateOnly": true
    },
    "B08301_017E": {
      "label": "Estimate!!Total!!Motorcycle",
      "concept": "MEANS OF TRANSPORTATION TO WORK",
      "predicateType": "int",
      "group": "B08301",
      "limit": 0,
      "predicateOnly": true
    },
    "B08301_021E": {
      "label": "Estimate!!Total!!Worked at home",
      "concept": "MEANS OF TRANSPORTATION TO WORK",
      "predicateType": "int",
      "group": "B08301",
      "limit": 0,
      "predicateOnly": true
    },
    "B08301_020E": {
      "label": "Estimate!!Total!!Other means",
      "concept": "MEANS OF TRANSPORTATION TO WORK",
      "predicateType": "int",
      "group": "B08301",
      "limit": 0,
      "predicateOnly": true
    },
  }
};

const estimatesEntries = Object.entries(data.variables)
  .filter(entry => entry[1].label.startsWith('Estimate!!'));

estimatesEntries.sort((a, b) => {
    if (a[1].label < b[1].label) return -1;
    if (a[1].label > b[1].label) return 1;
    return 0;
  })

  console.log(estimatesEntries.map(([name]) => name));

const estimates = estimatesEntries.reduce((obj, [name, props]) => {
    const labelPieces = props.label.split('!!');
    const label = labelPieces.slice(2).join(': ');
    const result = {...obj};
    if (label) result[label] = name;
    return result;
  }, {});


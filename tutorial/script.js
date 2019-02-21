const variables = {
  'Public transportation (excluding taxicab)': 'B08301_010E',
  'Drove alone': 'B08301_003E',
  Bicycle: 'B08301_018E',
  Walked: 'B08301_019E',
  Taxicab: 'B08301_016E',
  Motorcycle: 'B08301_017E',
};

let cachedData;
const transportationTypeSelect = document.querySelector('#transportation-type');
const normalizeCheckbox = document.querySelector('#normalize-control');

normalizeCheckbox.addEventListener('change', () => {
  loadGeoJSON(cachedData);
});
transportationTypeSelect.addEventListener('change', () => {
  loadGeoJSON(cachedData);
});

populateSelect();

// Create map with settings
const map = L.map('map').setView([37.0902, -95.7129], 5);

// Add map layers
const tiles = new L.StamenTileLayer('toner');
// const tiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
// 	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
// 	maxZoom: 16
// });
// const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
// 	subdomains: 'abcd',
// 	maxZoom: 19
// });
map.addLayer(tiles);

let shapesLayer = L.geoJSON();
map.addLayer(shapesLayer);


// Request API data
fetch(`./data.geo.json`)
  .then(response => response.json())
  .then(data => {
    cachedData = data;
    loadGeoJSON(data);
  });

// Create visualization

function populateSelect () {
  const options = Object.keys(variables).map(variableLabel => {
    const option = document.createElement('option');
    option.value = variables[variableLabel]; 
    option.textContent = variableLabel;
    return option
  });
  transportationTypeSelect.append(...options);
}

const topRank = document.querySelector('#rank-top');
const bottomRank = document.querySelector('#rank-bottom');

function updateRanks (data) {
  const transportationType = transportationTypeSelect.value;
  const featureProps = data.features.map(feature => feature.properties)

  featureProps.sort((featureA, featureB) => {
    const featureAValue = Math.round(featureA[transportationType] / featureA['B08301_001E'] * 1000) / 10
    const featureBValue = Math.round(featureB[transportationType] / featureB['B08301_001E'] * 1000) / 10
    return featureAValue - featureBValue;
  });

  const bottom = featureProps.slice(0, 5);
  const top = featureProps.slice(featureProps.length - 5).reverse();

  bottomRank.innerHTML = bottom.map(createRankItem).join('');
  topRank.innerHTML = top.map(createRankItem).join('');
}

function createRankItem (feature) {
  return `
  <li class="rank__item">
    <dt class="rank__name" title="${feature.NAME}">${feature.NAME}</dt><dd class="rank__percent">${(Math.round(feature[transportationTypeSelect.value] / feature['B08301_001E'] * 1000) / 10).toFixed(1)}%</dd>
  </li>
`}

function loadGeoJSON (data) {
  shapesLayer.remove();
  const selectedVariable = transportationTypeSelect.value;
  const variableValues = data.features.map(feature => feature.properties[selectedVariable] / feature.properties['B08301_001E']);
  const [min, max] = [Math.min(...variableValues), Math.max(...variableValues)];

  shapesLayer = L.geoJSON(data, {
    style: (feature) => {
      const featureValue = feature.properties[selectedVariable];
      if (featureValue === null) return { color: 'gray' };
      
      const percentage = normalizeCheckbox.checked ? (featureValue / feature.properties['B08301_001E'] - min) /max : featureValue / feature.properties['B08301_001E'];
      let lightness = 20;
      if (percentage < .75) lightness = 40;
      if (percentage < .5) lightness = 60;
      if (percentage < .25) lightness = 80;
      if (percentage < .1) lightness = 95;

      return {
        color: `hsl(270, 100%, ${lightness * 0.9}%)`,
        weight: 1,
        fillColor: `hsl(270, 100%, ${lightness}%)`,
        fillOpacity: 0.9,
      }
  },
  onEachFeature: (feature, layer) => {
    layer.on('mouseover mousemove', event => {
      const selectedVariable = transportationTypeSelect.value;
      layer.setStyle({ weight: 3 });
      const popup = new L.Rrose({ offset: new L.Point(0, -10), closeButton: false, autoPan: false })
        .setContent(`
        <div class="tooltip">
          <h1 class="tooltip__title">${feature.properties.NAME || feature.properties.NAME10}</h1>
          <p class="tooltip__paragraph"><span class="tooltip__percent">${Math.round(feature.properties[transportationTypeSelect.value] / feature.properties['B08301_001E'] * 1000) / 10}%</span> of surveyed individuals took ${document.querySelector(`option[value="${selectedVariable}"]`).textContent} to work.</p>
        </div>`)
        .setLatLng(event.latlng)
        .openOn(map);
    });
    layer.on('mouseout', () =>  {
      layer.setStyle({ weight: 1 });
      map.closePopup() 
    });
    layer.on('click', event => {
      const {bbox} = feature.geometry;
      const bounds = L.latLngBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]]);
      map.fitBounds(bounds);
    });
  }
  }).addTo(map);

  updateRanks(data);
}

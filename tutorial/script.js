const variables = {
  // "total": "B08301_001E",
  "car": "B08301_002E",
  "transit": "B08301_010E",
  "walk": "B08301_019E",
  "worked at home": "B08301_021E",
};

let cachedData;
const transportationTypeSelect = document.querySelector('#transportation-type');

transportationTypeSelect.addEventListener('change', event => {
  loadGeoJSON(cachedData);
});

populateSelect();

const DATA_API_BASE = 'https://developer.nrel.gov/api';
// Create map with settings
const map = L.map('map').setView([37.0902, -95.7129], 5);

// Add map layers
const tiles = new L.StamenTileLayer('toner-background');
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
  
// fetch(`${DATA_API_BASE}/alt-fuel-stations/v1.json?api_key=${'izgzDMohMevjROKshguqy70mOyD51nO77BRArS4j'}&city=Chicago&state=IL`)
//   .then(response => response.json())
//   .then(data => {
//     data.fuel_stations.forEach(station => {
//       L.circleMarker([station.latitude, station.longitude], { stroke: false, fillColor: '#fff700', fillOpacity: 1 })
//       .bindTooltip(`<h1>${station.station_name}</h1>`)
//       .addTo(map);
//     });
//   })

// fetch(`${DATA_API_BASE}/cleap/v1/gasoline_and_diesel_use?api_key=${'izgzDMohMevjROKshguqy70mOyD51nO77BRArS4j'}&zip=60605`)
//   .then(response => response.json())
//   .then(console.log)

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

function loadGeoJSON (data) {
  shapesLayer.remove();
  const selectedVariable = transportationTypeSelect.value;
  const variableValues = data.features.map(feature => feature.properties[selectedVariable] / feature.properties['B08301_001E']);
  const [min, max] = [Math.min(...variableValues), Math.max(...variableValues)];

  shapesLayer = L.geoJSON(data, {
    style: (feature) => {
      if (feature.properties[selectedVariable] === null) return { color: 'red' };
      return {
        color: 'transparent',
        fillColor: `hsl(${120 * ((feature.properties[selectedVariable] / feature.properties['B08301_001E'] - min) /max)}, 100%, 50%)`,
        fillOpacity: 0.8,
      }
  },
  onEachFeature: (feature, layer) => {
    layer.bindTooltip(`
    <h1>${feature.properties.NAME || feature.properties.NAME10}</h1>
    <p>${Math.round(feature.properties[transportationTypeSelect.value] / feature.properties['B08301_001E'] * 100)}%</p>
    `)
  }
  }).addTo(map);
}

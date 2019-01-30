const DATA_API_BASE = 'https://developer.nrel.gov/api';
// Create map with settings
const map = L.map('map').setView([41.85, -87.65], 13);

// Add map layers
const layer = new L.StamenTileLayer('toner-background');
map.addLayer(layer);

// Request API data
fetch(`${DATA_API_BASE}/alt-fuel-stations/v1.json?api_key=${DATA_API_KEY}&city=Chicago&state=IL`)
  .then(response => response.json())
  .then(data => {
    data.fuel_stations.forEach(station => {
      L.circleMarker([station.latitude, station.longitude], { stroke: false, fillColor: '#9f0', fillOpacity: 1 })
      .bindTooltip(`<h1>${station.station_name}</h1>`)
      .addTo(map);
    });
  })

// Create visualization

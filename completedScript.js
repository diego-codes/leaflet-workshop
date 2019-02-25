const myMap = L.map('my-map').setView([37.0902, -95.7129], 5)

// Create a tile layer and add it to my map
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', 
  {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash Map data &copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
  })
  .addTo(myMap)



// Get data from GeoJSON file
fetch('./metros.json')
  .then((response) => {
    return response.json()
    })

  .then((metros) => {
    const geoJSONLayer = L.geoJSON(metros, {
      // Tell Leaflet how we want to style every metro shape created using the
      // function declared above.
      style: colorMetros,

      // Set interaction for all metro areas
      onEachFeature: setMetroInteractions
    }).addTo(myMap)

    // Re-color metros when the user changes mode of transportation in
    // the dropdown selector
    transportationModeElem.addEventListener('change', () => {
      geoJSONLayer.setStyle(colorMetros)
    })
  })


// Get reference to transportation mode dropdown selector
const transportationModeElem = document.querySelector('#transportation-mode')

// This function defines the metro color given the data range for
// each transportation mode
const colorMetros = (metro) => {
  // Get currently selected transporation mode in the dropdown selector
  const selectedTransportationMode = transportationModeElem.value

  // For any given transporation mode, the percentages of commuters tend to
  // cluster around similar values so we use the rank stat for each metro
  // so we get a wider range of shades of purples
  const rank = metro.properties[selectedTransportationMode].rank

  // Set buckets of lighness depending on the rank
  let lightness = 10
  if (rank < 0.9) lightness = 20
  if (rank < 0.8) lightness = 30
  if (rank < 0.7) lightness = 40
  if (rank < 0.6) lightness = 50
  if (rank < 0.5) lightness = 60
  if (rank < 0.4) lightness = 70
  if (rank < 0.3) lightness = 80
  if (rank < 0.2) lightness = 90
  if (rank < 0.1) lightness = 95

  return {
    // Make stoke color a bit darker than the fill color
    color: `hsl(270, 100%, ${lightness * 0.95}%)`,
    weight: 1,
    fillColor: `hsl(270, 100%, ${lightness}%)`,
    fillOpacity: 0.9,
  }
}

const myTooltip = L.tooltip({
  className: 'tooltip',
  sticky: true
})

// Function to add interactions to all metros
const setMetroInteractions = (metro, layer) => {
  // Bind tooltip to shape layer so it is displayed when the user
  // hovers over the layer
  layer.bindTooltip(myTooltip)

  layer.on('mouseover', () => {
    // On mouse over, bring layer to front so we can see the outline 
    // and make it thicker
    layer.bringToFront()
    layer.setStyle({
      weight: 3,
    })

    // Get selected value from transportation mode dropdown
    const selectedTransportationMode = transportationModeElem.value

    // Get the text inside of the transportation mode option that is selected
    const selectedVariableLabel = transportationModeElem.querySelector(`option[value="${selectedTransportationMode}"]`).textContent


    // Get percentage value for each metro area given the selected
    // transportation mode
    const percent = metro.properties[selectedTransportationMode].percent

    // Round percentage value so that we can get precision to two 
    // decimal places
    const roundedPercent = Math.round(percent * 10000) / 100

    // Update tooltip content with data related to metro area
    // the user is hovering over
    myTooltip.setContent(`
      <h1 class="tooltip__title">${metro.properties.name}</h1>
      <p class="tooltip__paragraph">
        In the ${metro.properties.name} metro area, an estimated <span class="tooltip__percent">${roundedPercent}%</span> of workers ${selectedVariableLabel.toLowerCase()} to work.
      </p>
    `)
  })

  // When the user's mouse leaves the shape layer, re-set the
  // metro area outline thickness to 1px
  layer.on('mouseout', () => {
    layer.setStyle({
      weight: 1,
    })
  })

  // When user clicks zoom into map to show metro in greater detail
  layer.on('click', () => {
    // bbox refers to "bounding box" and defined where the shape (metro) 
    // lives within the map area
    const bbox = metro.geometry.bbox;
    const bounds = L.latLngBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]]);

    myMap.fitBounds(bounds, {
      maxZoom: 7,
    })
  })
}
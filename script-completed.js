// Create map variable
const map = L.map('my-map').setView([37.0902, -95.7129], 5)

// Add tiles to map
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash Map data &copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  ext: 'png'
}).addTo(map)

   // Get reference to transportation type input element
   const transportationTypeElem = document.querySelector('#transportation-type')

   // Create a function that returns a styling function so we can access the entire
   // data object not just the feature
   const createFeatureStyler = (data) => {
      return (feature) => {
        // Get value from transportation type input element
        const selectedTransportationType = transportationTypeElem.value

        // Get min and max percent values for the entire dataset for the currently
        // selected transportation type
        const totalPercent = data.properties[selectedTransportationType].percent

        // Calculate the rank of this percent from the range of min and max value in
        // the dataset for the currently selected transporation type
        const rank = (feature.properties[selectedTransportationType].percent - totalPercent.min) / totalPercent.max

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
   }

    // Create tooltip
    const tooltip = L.tooltip({
      className: 'tooltip',
      sticky: true
    })
 
   // Function to add shape layers interactions to all layer
   const setLayerInteractions = (feature, layer) => {
     // Bind tooltip to shape layer so it is displayed when the user
     // hovers over the layer
     layer.bindTooltip(tooltip)
 
     layer.on('mouseover', () => {
       // On mouse over, bring layer to front so we can see the 
       // outline and make it thicker
       layer.bringToFront()
       layer.setStyle({
         weight: 3,
       })
 
       // Get selected value from transportation type input
       const selectedTransportationType = transportationTypeElem.value
 
       // Get percent value for metro area of the selected
       // transportation type
       const percent = feature.properties[selectedTransportationType].percent
 
       // Round percent so that we can get precision to one
       // decimal place
       const roundedPercent = Math.round(percent * 1000) / 100
 
       // Get the text inside of the transportaion type option that
       // is selected
       const selectedVariableLabel = transportationTypeElem.querySelector(`option[value="${selectedTransportationType}"]`).textContent
 
       // Update tooltip content with data related to metro area
       // the user is hovering over
       tooltip.setContent(`
           <h1 class="tooltip__title">${feature.properties.name}</h1>
           <p class="tooltip__paragraph">
             Of workers in ${feature.properties.name}, an estimated <span class="tooltip__percent">${roundedPercent}%</span> of them ${selectedVariableLabel.toLocaleLowerCase()} to work.
           </p>
         `)
     })
 
     // When the user's mouse leaves the shape layer re-set the
     // outline thickness to 1px
     layer.on('mouseout', () => {
       layer.setStyle({
         weight: 1,
       })
     })

     layer.on('click', () => {
      const {bbox} = feature.geometry;
      const bounds = L.latLngBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]]);
      map.fitBounds(bounds, {
        maxZoom: 8,
     })
   })
   }
 
    fetch('./data.geo.json')
     .then((response) => {
       return response.json()
      })
     .then(data => {
       const styleFeature = createFeatureStyler(data)
       const geoJSONLayer = L.geoJSON(data, {
         style: styleFeature,
 
         // Add function for each feature layer
         onEachFeature: setLayerInteractions,
       }).addTo(map)
 
       transportationTypeElem.addEventListener('change', () => {
         geoJSONLayer.setStyle(styleFeature)
       })
     })
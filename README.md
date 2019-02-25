# Chicago DataViz Leaflet workshop
Leaflet is an open-source JavaScript library for mobile-friendly interactive maps. Similar to Google Maps, it provides a presentational layer to geographical data.

## How is Leaflet different from other GIS tools?
Unlike traditional GIS tools like Esri, Leaflet uses the full power of the web to create dynamic maps based on any data. GIS tools tend to focus more on static mapmaking whereas Leaflet is a tool designed to be used for the web.

## When is Leaflet a good tool to use over D3?
Any situation where you want to overlay geographic data over detailed maps like streets maps or topography, Leaflet is a good tool to use. Through the use of layers called "tiles", you can set many different maps as the base of your visualization, like streets, topography, {OTHER EXAMPLE}. And this doesn't just work for Earth, you can create maps that are based on a different body of mass like Mars, the Sun, etc.

The nice thing about Leaflet is that it provides standard interactive mapping controls like zooming, panning, and tile rendering based on zoom levels. And unlike Google Maps, you can use Javascript to write script that react to these types of interactions.


### Demonstration of benefits
- **Map layers:** Give users better context especially if they are not familiar with the shapes or geographies presented
- **Zooming:** Provide higher fidelity visualizations when up close and provide greater context when zoomed out 
- **Panning:** Load data as needed

## What is GeoJson?
GeoJson is a format for encoding a variety of geographic data structures using... you guessed it JSON. With GeoJson you can represent points, lines, polygons and other geometric shapes over maps. **GeoJson uses Earth coordinate system to set the properties of these things.** This can be compared to shape or kml files used by Esri and Google respectively. GeoJson uses JSON syntax, it works really well for web-based mapping tools like APIs, JSON-based document databases and, you guessed it again Leaftlet.

## Tutotrial
### Create map
First we need to create a map that we can add data to.

1. **Create a map variable using Leaflet:** 

   Doing this, gets an HTML element that has an ID of `map` and creates a Leaflet map inside of it with the view settings we provide. For our view, we will set the coordinates and zoom level so we can see most of the [continenal US](https://www.google.com/search?q=us+coordinates).

   ```js
   const map = L.map('map').setView([37.0902, -95.7129], 5)
   ```
   
   You should see Leaflet zoom controls but a blank map.

2. **Add tiles to map:**

   All Leaflet maps need to get access to map tiles so we can see any geography. There are several [map tile providers](https://leaflet-extras.github.io/leaflet-providers/preview/) that work with Leaflet, for this tutorial we'll be using Stamen Design's toner background tiles.

   ```js
   /* ...map variable */

   L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash Map data &copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: 'png'
    }).addTo(map)
   ```


### Visualize data on map
Now that we have a working map, let's add some data to it!

1. **Fetch data:**
   
   For this workshop, we have file with GeoJSON data from the US Census. In a real-world use case you'd be fetching data from their APIs, but for the sake of the workshop I've aleady gotten the data and cleaned it up for you.

   We're going to be looking at a small set of [US metro areas and their commuting](https://factfinder.census.gov/faces/tableservices/jsf/pages/productview.xhtml?pid=ACS_17_5YR_B08301&prodType=table) habits from the US Census Bureau's 2013-2017 American Community Survey 5-Year Estimates from the US Census Bureau's 2013-2017 American Community Survey 5-Year Estimates.

   ```js
   /* ...map with tiles */

   fetch('./data.geo.json')
    .then((response) => {
      return response.json()
     })
    .then((data) => {
      console.log(data)
    })
   ```

   If you open the console in your browser, you will see that an object was logged in there. This is the data we got from the JSON file.

2. **Generate shapes:** 

   To get the data to be displayed on our map, we're going to use Leaflet's `geoJSON` utility function to do this.

   ```js
   /* ...map with tiles */

   fetch('./data.geo.json')
    .then((response) => {
      return response.json()
     })
    .then((data) => {
      const geoJSONLayer = L.geoJSON(data).addTo(map)
    })
   ```

   We have shapes in our map!

3. **Styling shapes:**

   The `geoJSON` utility function also accepts options that help you control the look and interactions of the GeoJSON data.

   ```js
   /* ...map with tiles */

   const styleFeature = (feature) => {
      return {
        // stroke color in hue (degree), saturation (percent), lightness (percent)
        color: 'hsl(270, 100%, 50%)', 

        // stroke width in pixels
        weight: 1,

        // fill color in HSL format
        fillColor: 'hsl(270, 100%, 50%)', 
        
        // fill opacity 0 - 1
        fillOpacity: 0.9,
      }
   }

   fetch('./data.geo.json')
    .then((response) => {
      return response.json()
     })
    .then((data) => {
      const geoJSONLayer = L.geoJSON(data, {
        style: styleFeature,
      }).addTo(map)
    })
   ```

   The shapes should now have a purple-ish color.

4. **Visualize data via color lightness:**
  
   To visualize differences in values in our shapes, we're going to be playing with the colors' lightness value. Our goal is to make the metro shapes with higher values to have lower lightness to make them more vibrant to represent higher values.

   For this, we are going to use the default value of the select input field for transportation type.

   ```js
   /* ...map with tiles */
   
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

   fetch('./data.geo.json')
    .then((response) => {
      return response.json()
     })
    .then(data => {
      // Create style feature function with the fetched data
      const styleFeature = createFeatureStyler(data)

      const geoJSONLayer = L.geoJSON(data, {
        // Use newly created function to style features
        style: styleFeature,
      }).addTo(map)
    })
   ```

   Looking good! We now have color values representing our data.

### Make map interactive
Without interactivity, our map is boring and missing a lot of key information. Let's make it more interesting by adding interactions!

1. **Update map on transportation type changes:**

   We have a select element for the user to visualize different transportation types. Let's update the map when user makes a transportation type selection.

   ```js
   /* ...map with tiles */
   /* ...styler function  */

   fetch('./data.geo.json')
    .then((response) => {
      return response.json()
     })
    .then(data => {
      const styleFeature = createFeatureStyler(data)
      const geoJSONLayer = L.geoJSON(data, {
        style: styleFeature,
      }).addTo(map)

      // Run style feature function again when selection changes
      transportationTypeElem.addEventListener('change', () => {
        geoJSONLayer.setStyle(styleFeature)
      })
    })
   ```
2. **Add tooltips:**
   
   We're going to use the `onEachFeature` to add a custom tooltip on every metropolitan area shape.

   ```js
   /* ...map with tiles */

   /* ...styler function  */

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
   ```


3. **Zoom to shape on click:**
   
   Finally, we will make the shapes clickable and when clicked, we will zoom in on the map to show the shape in more detail

   ```js
   /* ...map with tiles */
   /* ...styler function  */

   const setLayerInteractions = (feature, layer) => {
     /* ...mouseover and out interactions */

     layer.on('click', () => {
       const {bbox} = feature.geometry;
       const bounds = L.latLngBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]]);
       map.fitBounds(bounds, {
         maxZoom: 8,
      })
    })
   }

   /* ...fetch data */
   ```
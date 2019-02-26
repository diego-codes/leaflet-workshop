# Chicago DataViz Leaflet workshop

## Table of content
- [Overview](#overview)
  - [What is Leaflet?](#what-is-Leaflet)
  - [How is Leaflet different from other GIS tools?](#how-is-leaflet-different-from-other-gis-tools)
  - [When is Leaflet a good tool to use over D3.js?](#when-is-leaflet-a-good-tool-to-use-over-d3js)
- [Workshop](#workshop)
  - [Get started](#get-started)
  - [Create map](#create-map)
  - [Visualize data on map](#visualize-data-on-map)
  - [Make map interactive](#make-map-interactive)
- [Resources ](#resources)


## Overview
### What is Leaflet?
Leaflet is an open-source JavaScript library for mobile-friendly interactive maps. Similar to Google Maps, it provides a presentational layer to geographic data.

### How is Leaflet different from other GIS tools?
Unlike traditional GIS (Geographic Information Systems) tools like Esri's ArcGIS or the freeware QGIS, Leaflet uses the full power of the web to create dynamic maps based on any data. GIS tools tend to focus more on static mapmaking whereas Leaflet is a tool designed to be used for the web.

### When is Leaflet a good tool to use over D3.js?
Any situation where you want to overlay geographic data over detailed maps like streets maps or topography, Leaflet is a good tool to use. Through the use of layers called "tiles", you can set many different maps as the base of your visualization, like streets, topography, or territory boundaries.

The nice thing about Leaflet is that it provides standard interactive mapping controls like zooming, panning, and tile rendering based on zoom levels. And unlike Google Maps, you can use Javascript to write script that reacts to these types of interactions.

With that said, Leaflet and D3.js can work really well together.


## Workshop

We're going to be creating a map that will look like this: https://diego-codes.github.io/leaflet-workshop/ 

I highly recommend using Chrome or Firefox as we're using newer Javascript features that may not work on other browers.

If you get stuck and need to see the final code, you can find it in [`./completedScript.js`](https://github.com/diego-codes/leaflet-workshop/blob/master/completedScript.js)

### Get started
1. **Get the files:**

   The easiest way to get the files needed for this workshop is to download a .zip file with all of the files that you need to get started.
   
   Scroll up and click on the green button that says **Clone or download** and click **Download ZIP** in the pop up.
   
   Alternatively, if you're familiar with Git and the command line, clone this repository.

2. **Open map:**
   
   Open the `index.html` file from the downloaded folder in your browser of choice. Every time we make a change in the code, you'll want to refresh the page to see the changes.

3. **Open script file:**
   Open the downloaded folder in your text editor of choice.

   The map is composed of a CSS file for styles (`style.css`), a Javascript file(`script.js`), and an HTML file to bring it all together (`index.html`). We are not going to change anything in the CSS or HTML files.

   For this workshop, we're going to be coding solely in the `script.js` file, so open this file.


### Create map
First we need to create a map where we can add data.


1. **Create a map variable using Leaflet:** 

   Doing this you'll get an HTML element that has an ID of `my-map` which creates a Leaflet map inside of it with the view provided settings. For our view, we will set the coordinates and zoom level so we can see most of the [continental US](https://www.google.com/search?q=us+coordinates).

   ```js
   const myMap = L.map('my-map').setView([37.0902, -95.7129], 5)
   ```
   
   You should see Leaflet zoom controls but a blank map.

2. **Add tiles to map:**

   All Leaflet maps need to access to map tiles so we can see any geography. There are several [map tile providers](https://leaflet-extras.github.io/leaflet-providers/preview/) that work with Leaflet. For this tutorial we'll be using Stamen Design's toner background tiles.

   ```js
   /* ...map variable */
   
   // Create a tile layer and add it to my map
   L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', 
     {
       attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash Map data &copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
       ext: 'png'
     })
     .addTo(myMap)
   ```


### Visualize data on map
Now that we have a working map, let's add some data to it!

1. **Fetch data:**
   
   For this workshop, we have the file `metros.json` with GeoJSON format data from the US Census. In a real-world use case you'd be fetching data from [their API's](https://www.census.gov/data/developers/data-sets/acs-5year.html), but for the sake of the workshop I've aleady gotten the data and cleaned it up for you.

   We're going to be looking at a small set of [US metro areas and their commuting](https://factfinder.census.gov/faces/tableservices/jsf/pages/productview.xhtml?pid=ACS_17_5YR_B08301&prodType=table) habits from the US Census Bureau's 2013-2017 American Community Survey 5-Year Estimates.

   GeoJson is a format for encoding a variety of geographic data structures using... you guessed it JSON. With GeoJSON you can represent points, lines, polygons and other geometric shapes over maps. **GeoJSON uses Earth coordinate system to set the properties of these things.** This can be compared to shape or kml files used by Esri and Google respectively. GeoJSON uses JSON syntax, it works really well for web-based mapping tools like APIs, JSON-based document databases and, you guessed it again - Leaflet.

   ```js
   /* ...map with tiles */

   // Get data from GeoJSON file
   fetch('https://raw.githubusercontent.com/diego-codes/leaflet-workshop/master/metros.json')
    .then((response) => {
      return response.json()
     })
    .then((metros) => {
      // Log metros data gotten from GeoJSON file
      console.log(metros)
    })
   ```

   If you open the console in your browser, you should see that an object was logged in there. This is the data we got from the GeoJSON file.

2. **Generate metro shapes:** 

   To get the data to be displayed on our map, we're going to use Leaflet's `geoJSON` utility function to do this.

   ```js
   /* ...map with tiles */

   // Get data from GeoJSON file
   fetch('https://raw.githubusercontent.com/diego-codes/leaflet-workshop/master/metros.json')
    .then((response) => {
      return response.json()
     })
    .then((metros) => {
      // Create GeoJSON layer with metros data and to my map
      const geoJSONLayer = L.geoJSON(metros).addTo(myMap)
    })
   ```

   We have shapes in our map!

3. **Styling shapes:**

   The `geoJSON` utility function also accepts options that help you control the look and interactions of the GeoJSON data.

   ```js
   /* ...map with tiles */

   // Get data from GeoJSON file
   fetch('https://raw.githubusercontent.com/diego-codes/leaflet-workshop/master/metros.json')
    .then((response) => {
      return response.json()
     })

    .then((metros) => {
      const geoJSONLayer = L.geoJSON(metros, {
        // Tell Leaflet how we want to style every metro shape created using the
        // function declared above.
        style: colorMetros,
      }).addTo(myMap)
    })

   // Just give all metros a purple-ish color to make sure this function works.
   // Leaflet expects that a style function returns styling attributes so it
   // knows how to present each metro on the map
   const colorMetros = () => {
      return {
        // outline color in hue (degree), saturation (percent), 
        // lightness (percent)
        color: 'hsl(270, 100%, 50%)', 

        // outline width in pixels
        weight: 1,

        // fill color in HSL format
        fillColor: 'hsl(270, 100%, 50%)', 
        
        // fill opacity 0 - 1
        fillOpacity: 0.9,
      }
   }
   ```

   The shapes should now have a purple-ish color.

4. **Visualize data via color lightness:**
  
   To visualize differences within values inside our shapes, we're going to be setting the shade of purple based on each metro stats in the GeoJSON data. Our goal is to make metro shapes with higher values darker (lower lightness) to make them more vibrant.

   The color differences within the map will depend on the transporation mode selected in the dropdown. By default, we will use public transportation as the selected transportation mode.

   ```js
   /* ...map with tiles */
   /* ...fetch GeoJSON data */

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
   ```

   Looking good! We now have color values representing our data.

### Make map interactive
Without interactivity, our map is boring and missing a lot of key information. Let's make it more interesting by adding interactions!

1. **Update map on transportation mode changes:**

   We have a dropdown selector for the user to visualize different transportation modes. Let's update the map when user chooses a transportation mode selection.

   ```js
   /* ...map with tiles */

   // Get data from GeoJSON file
   fetch('https://raw.githubusercontent.com/diego-codes/leaflet-workshop/master/metros.json')
    .then((response) => {
      return response.json()
     })

    .then((metros) => {
      /* ...create GeoJSON layer */

      // Re-color metros when the user changes mode of transportation in
      // the dropdown selector
      transportationModeElem.addEventListener('change', () => {
        geoJSONLayer.setStyle(colorMetros)
      })
    })

    /* ...colorMetros function */
   ```
2. **Add tooltips:**
   
   We're going to add a custom tooltip on every metropolitan area shape by using Leaflet's geoJSON `onEachFeature`.

   ```js
   /* ...map with tiles */

   // Get data from GeoJSON file
   fetch('https://raw.githubusercontent.com/diego-codes/leaflet-workshop/master/metros.json')
    .then((response) => {
      return response.json()
     })

    .then((metros) => {
      const geoJSONLayer = L.geoJSON(data, {
        // Tell Leaflet how we want to style every metro shape created using the
        // function declared above.
        style: colorMetros,

        // Set interaction for all metro areas
        onEachFeature: setMetroInteractions,
      }).addTo(myMap)

      /* ...event listener for transportation type dropdown selector */
    })

   /* ...colorMetros function  */

   // Create tooltip object to add to map
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
       const transportationModeLabel = transportationModeElem.querySelector(`option[value="${selectedTransportationMode}"]`).textContent


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
          In the ${metro.properties.name} metro area, an estimated <span class="tooltip__percent">${roundedPercent}%</span> of workers ${transportationModeLabel.toLowerCase()} to work.
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
   }
   ```


3. **Zoom to metro when clicked:**
   
   Finally, we will make the metros clickable and, when clicked, we will zoom in on the map to show the that shape in more detail.

   ```js
   /* ...map with tiles */
   /* ...fetch GeoJSON data */
   /* ...colorMetros function  */

   // Function to add interactions to all metros
   const setMetroInteractions = (metro, layer) => {
     /* ...mouseover and out interactions */

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
   ```

## Resources
- [Leaflet tutorials](https://leafletjs.com/examples.html)
- [Leaflet documentation](https://leafletjs.com/reference-1.4.0.html)
- [GeoJSON specification](http://geojson.org/)
- US Census [American FactFinder](https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml) to explore data the census collects
- US Census [developers portal](https://www.census.gov/developers/)
- [CitySDK](https://github.com/uscensusbureau/citysdk) Javascript package for working with US Census APIs
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


// USGS Earthquake Data
//var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson";
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Create map object and set default layers
var start = [38.8, -122.8];
var usgsMap = L.map("map", {
  center: start,
  zoom: 6,
  layers: [baseMaps.Light]
});

// Create a function to assign a color
function getColor(val)
{
  let color = Math.floor(val);
  switch (color)
  {
    case (0): return "Green";
    case (1): return "Yellow";
    case (2): return "GoldenRod";
    case (3): return "Orange";
    case (4): return "OrangeRed";
    case (5): return "Red";
    default: return "Red";
  }
}


// Create a layer for earthquake data
var earthquakeLayer = L.layerGroup().addTo(usgsMap);

// Grab data with d3
d3.json(geoData, function(data) 
{
    // Loop through data
    for (var i = 0; i < data.features.length; i++) 
    {
      // Set the data location property to a variable
      var location = data.features[i].geometry;
      
      // Check for location property
      if (location) 
      {
        L.circle([location.coordinates[1],location.coordinates[0]], 
        {
          color: "black",
          fillColor: getColor(data.features[i].properties.mag),
          fillOpacity: 0.5,
          radius: 2000.0 * data.features[i].properties.mag,
          weight: 0.5
        }).addTo(earthquakeLayer);
      }
   }
});

// Create a dictionary of overlays
var overlayMaps = {
    Earthquakes: earthquakeLayer
};

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(usgsMap);
// USGS Earthquake Data
var geoDataHour = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson";
var geoDataDay = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var geoDataMonth = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Create map object and set default layers
var start = [38.8, -122.8];
var usgsMap = L.map("map", {
  center: start,
  zoom: 6,
  layers: [baseMaps.Light]
});

// Create a function to assign a color
var colors = ["Green", "Yellow", "GoldenRod", "Orange", "OrangeRed", "Red"];
function getColor(val)
{
  let color = Math.floor(val);
  return color > 5 ? colors[5] : colors[color];
}

// Create a layer for earthquake data
var earthquakeLayerHour = L.layerGroup().addTo(usgsMap);
var earthquakeLayerDay = L.layerGroup().addTo(usgsMap);
var earthquakeLayerMonth = L.layerGroup().addTo(usgsMap);

// Create earthquake data
createEarthquakeLayer(geoDataHour, earthquakeLayerHour);
createEarthquakeLayer(geoDataDay, earthquakeLayerDay);
createEarthquakeLayer(geoDataMonth, earthquakeLayerMonth);

// Create the legend
createLegend();

// Function to create an earthquake layer
function createEarthquakeLayer(geoData, earthquakeLayer)
{
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
          var msg = "<h3>Magnitude:  " + data.features[i].properties.mag + "</h3>" +
            "<hr>" +
            "<div>Date:  " + Date(data.features[i].properties.time) + "</div>" + 
            "<div>Coordinates:  (" + location.coordinates[1] + ", " + location.coordinates[0] + ")</div>" +
            "<div>Depth:  " + location.coordinates[2] + "</div>" +
            "<div>IDs:  " + data.features[i].properties.ids + "</div>" +
            "<div>Type:  " + data.features[i].properties.type + "</div>" +
            "<div>Place:  " + data.features[i].properties.place + "</div>" +
            "<a href=\"" + data.features[i].properties.url + "\" target=\"_blank\">More Information</a>";

          L.circle([location.coordinates[1],location.coordinates[0]], 
          {
            color: "black",
            fillColor: getColor(data.features[i].properties.mag),
            fillOpacity: 0.5,
            radius: 2000.0 * data.features[i].properties.mag,
            weight: 0.5
          }).bindPopup(msg).addTo(earthquakeLayer);
        }
    }
  });
}
 
// Grab the fault line data
var faultLinesLink = "/data/PB2002_plates.json";

// Create a layer for fault line data
var faultLineLayer = L.layerGroup().addTo(usgsMap);

// Grabbing our GeoJSON data..
d3.json(faultLinesLink, function(data) 
{
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, 
  {
    // Style each feature (in this case a neighborhood)
    style: function(feature) 
    {
      return {
        color: "yellow",
        fillOpacity: 0.0,
        weight: 1.5
      };
    }
  }).addTo(faultLineLayer);
});

function createLegend()
{
   // Set up the legend
   var legend = L.control({ position: "bottomright" });
   legend.onAdd = function() {
     var div = L.DomUtil.create("div", "my-legend");
     var labels = [];
 
     // Add min & max
     var legendInfo = "<div class=\"legend-title\">Magnitude</div>";
     div.innerHTML = legendInfo;
 
     colors.forEach(function(color, index) {
       labels.push("<li><span style=\"background-color: " + color + "\"> </span>" + (index === 5 ? "5+" : index + "-" + (index+1)) + "</li>");
     });
 
     div.innerHTML += "<div class=\"legend-scale\"><ul class=\"legend-labels\">" + labels.join("") + "</ul></div>";
     return div;
   };
 
  // Adding legend to the map
  legend.addTo(usgsMap);
}

// Create a dictionary of overlays
var overlayMaps = {
    "Earthquakes Last Hour": earthquakeLayerHour,
    "Earthquakes Last Day": earthquakeLayerDay,
    "Earthquakes Last Month": earthquakeLayerMonth,
    "Fault Lines": faultLineLayer
};

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(usgsMap);

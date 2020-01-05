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
var colors = ["Green", "Yellow", "GoldenRod", "Orange", "OrangeRed", "Red"];
function getColor(val)
{
  let color = Math.floor(val);
  return color > 5 ? colors[5] : colors[color];
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

   // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "my-legend");
    var labels = [];

    // Add min & max
    var legendInfo = //"<div class=\"my-legend\">" +
      "<div class=\"legend-title\">Magnitude</div>";// +
      // "<div class=\"legend-scale\">" +
      // "</div>" + 
      // "</div>";
      // "<div class=\"labels\">" +
        // "<div>0-1</div>" +
        // "<div>1-2</div>" +
        // "<div>2-3</div>" +
        // "<div>3-4</div>" +
        // "<div>5+</div>" +
      // "</div>";

    div.innerHTML = legendInfo;

    colors.forEach(function(color, index) {
      labels.push("<li><span style=\"background-color: " + color + "\"> </span>" + (index === 5 ? "5+" : index + "-" + (index+1)) + "</li>");
      // labels.push("<li style=\"background-color: " + color + "\"></li>" + "<div>" + (index === 5 ? "5+" : index + "-" + (index+1)) + "</div>");
    });

    div.innerHTML += "<div class=\"legend-scale\"><ul class=\"legend-labels\">" + labels.join("") + "</ul></div>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(usgsMap);
});

// Create a dictionary of overlays
var overlayMaps = {
    Earthquakes: earthquakeLayer
};

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(usgsMap);
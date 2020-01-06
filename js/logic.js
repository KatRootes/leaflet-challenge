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
        var msg = "<h3>Magnitude:  " + data.features[i].properties.mag + "</h3>" +
          "<hr>" +
          "<p>Type:  " + data.features[i].properties.type + "</p>" +
          "<p>Place:  " + data.features[i].properties.place + "</p>" +
          "<a src=\"" + data.features[i].properties.url + "\" href=\"" + data.features[i].properties.url + "\" target=\"_blank\">More Information</a>";

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
});

// Grab the fault line data
var faultLinesLink = "/data/PB2002_plates.json";

// Create a layer for fault line data
var faultLineLayer = L.layerGroup().addTo(usgsMap);

// Grabbing our GeoJSON data..
d3.json(faultLinesLink, function(data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        color: "yellow",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        // fillColor: "red",
        fillOpacity: 0.0,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
          map.fitBounds(event.target.getBounds());
        }
      });
    }
  }).addTo(faultLineLayer);
});

// Create a dictionary of overlays
var overlayMaps = {
    Earthquakes: earthquakeLayer,
    Faultlines: faultLineLayer
};

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(usgsMap);
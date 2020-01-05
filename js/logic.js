// Create map object and set default layers
var myMap = L.map("map", {
  center: [46.2276, 2.2137],
  zoom: 6,
  layers: [light] //[light, cityLayer]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps).addTo(myMap); //, overlayMaps).addTo(myMap);

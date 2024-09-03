// Function to create markers based on earthquake data
function createMarkers(response) {
    let earthquakes = response.features;
    let arrays = [];

    // Function to determine color based on earthquake depth
    function getColor(d) {
        return d > 90 ? '#800026' :
               d > 70  ? '#BD0026' :
               d > 50  ? '#E31A1C' :
               d > 30  ? '#FC4E2A' :
               d > 10   ? '#FD8D3C' :
               d > 0   ? '#FEB24C' :
               d > -10   ? '#FED976' :
                          '#FFEDA0';
    }

    // Loop through earthquake data to create markers
    for (let i = 0; i < earthquakes.length; i++) {
        let earthquake = earthquakes[i];
        let array = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]],{
            fillColor: getColor(earthquake.geometry.coordinates[2]),
            radius: earthquake.properties.mag * 25000,
            fillOpacity: 0.75,
            color: "white"
        }).bindPopup(`Magnitude: ${earthquake.properties.mag}<br>Depth: ${earthquake.geometry.coordinates[2]}<br>Location: ${earthquake.properties.place}<br>Time: ${new Date(earthquake.properties.time)}`);

        arrays.push(array);
    }

    let earthquake_points = L.layerGroup(arrays);

    // Create the tile layer for the street map
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let geoData = "https://services.arcgis.com/jIL9msH9OI208GCb/ArcGIS/rest/services/Tectonic_Plates_and_Boundaries/FeatureServer/1?f=pjson"
    
    let baseMaps = {
        "Street Map": streetmap
    };

    let overlayMaps = {
        "Earthquakes": earthquake_points
    };

    // Initialize the map with street map and earthquake points
    let map = L.map("map", {
        center: [40.05, -110.05],
        zoom: 4.5,
        layers: [streetmap, earthquake_points]
    });
    
    // Create legend for earthquake depth
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'info legend');
        let labels = ['90+', '90-70', '70-50', '50-30', '30-10', '10-0', '0-10', '>-10'];
        let colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A', '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0'];

        div.innerHTML = "<h4>Earthquake Depth</h4>";
        for (let i = 0; i < colors.length; i++) {
            div.innerHTML += '<i class="legend-color" style="background:' + colors[i] + '"></i> ' + labels[i] + '<br>';
        }

        return div;
    };
    
    legend.addTo(map);

    // Create a layer control and add it to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}

// Fetch earthquake data and call createMarkers function
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
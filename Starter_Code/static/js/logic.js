function createMarkers(response) {
    let earthquakes = response.features;
    let arrays = [];

    function getColor(d) {
        return d > 4 ? '#800026' :
               d > 3  ? '#BD0026' :
               d > 2.25  ? '#E31A1C' :
               d > 2  ? '#FC4E2A' :
               d > 1.75   ? '#FD8D3C' :
               d > .75   ? '#FEB24C' :
               d > 0   ? '#FED976' :
                          '#FFEDA0';};

    for (let i = 0; i < earthquakes.length; i++) {
        let earthquake = earthquakes[i];
        let array = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]],{
            fillColor: getColor(earthquake.geometry.coordinates[2]),
            radius: earthquake.geometry.coordinates[2] * 1500,
            fillOpacity: 0.75,
            color: "white"
        }).bindPopup(`Magnitude: ${earthquake.properties.mag}<br>Location: ${earthquake.properties.place}<br>Time: ${new Date(earthquake.properties.time)}`);

        arrays.push(array);
    };

    let earthquake_points = L.layerGroup(arrays);

    //Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let baseMaps = {
        "Street Map": streetmap
    };

    let overlayMaps = {
        "Earthquakes": earthquake_points
    };

    let map = L.map("map", {
        center: [40.05, -110.05],
        zoom: 5.5,
        layers: [streetmap, earthquake_points]
    }).addTo(map);
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);

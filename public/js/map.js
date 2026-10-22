
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [-71.06776, 42.35816],
    zoom: 9
});

map.addControl(new mapboxgl.NavigationControl());

map.on("load", () => {
    console.log("Map loaded successfully!");
});

map.on("error", (e) => {
    console.error("Mapbox error:", e.error);
});

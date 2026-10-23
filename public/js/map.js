
function initializeMap() {
    const mapElement = document.getElementById("map");

    if (!mapElement) {
        return;
    }

    if (!window.mapToken || typeof mapboxgl === "undefined") {
        console.error("Mapbox library or token is missing.");
        return;
    }

    const coordinates = window.listingCoordinates || [];

    if (coordinates.length !== 2) {
        console.error("Listing coordinates are missing.");
        return;
    }

    mapboxgl.accessToken = window.mapToken;

    const map = new mapboxgl.Map({
        container: mapElement,
        style: "mapbox://styles/mapbox/streets-v12",
        center: coordinates,
        zoom: 8
    });

    new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
                "<h4>Exact Location</h4>" +
                "<p>Exact location provided after booking.</p>"
            )
        )
        .addTo(map);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMap);
} else {
    initializeMap();
}

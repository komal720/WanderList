
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
        zoom: 10
    });

  new mapboxgl.Marker({
    color: "#fe424d"
})
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            maxWidth: "300px"
        })
        .setHTML(`
            <div class="map-popup">

                <div class="map-popup-icon">
                    <i class="fa-solid fa-location-dot"></i>
                </div>

                <div class="map-popup-content">
                    <h5>Where you'll be</h5>

                    <p class="map-popup-location">
                        <i class="fa-solid fa-map-pin"></i>
                        Exact Location
                    </p>

                    <p class="map-popup-text">
                        Exact location will be provided after booking.
                    </p>
                </div>

            </div>
        `)
    )
    .addTo(map);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMap);
} else {
    initializeMap();
}

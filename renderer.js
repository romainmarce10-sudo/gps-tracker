const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png').addTo(map);

const devices = {};
const paths = {};
let follow = true;

function updateDevice(id, lat, lon) {

    // 📍 Marker
    if (!devices[id]) {
        devices[id] = L.circleMarker([lat, lon], {
            radius: 8,
            color: '#00ff00',
            fillColor: '#00ff00',
            fillOpacity: 1
        }).addTo(map);
    } else {
        devices[id].setLatLng([lat, lon]);
    }

    // 🧭 Trajet
    if (!paths[id]) {
        paths[id] = L.polyline([[lat, lon]], { color: 'lime' }).addTo(map);
    } else {
        paths[id].addLatLng([lat, lon]);
    }

    // 🎥 Follow
    if (follow) {
        map.setView([lat, lon], 15);
    }
}

const socket = new WebSocket('ws://192.168.X.X:9090');

socket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);

        if (
            typeof data.id === "string" &&
            typeof data.lat === "number" &&
            typeof data.lon === "number"
        ) {
            updateDevice(data.id, data.lat, data.lon);
        }

    } catch (err) {
        console.log("Erreur réception");
    }
};
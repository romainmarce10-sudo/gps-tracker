const map = L.map('map').setView([20,0], 2);

// Carte OpenStreetMap gratuite
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const devices = {};

function updateDevice(id, lat, lon){
    if(devices[id]){
        devices[id].setLatLng([lat, lon]);
    } else {
        const marker = L.circleMarker([lat, lon], {
            radius: 10,
            color: '#00ff00',
            fillColor: '#00ff00',
            fillOpacity: 1
        }).addTo(map);

        devices[id] = marker;
        map.setView([lat, lon], 15);
    }
}

// WebSocket vers Render
const socket = new WebSocket('wss://gps-tracker-4gd1.onrender.com');

socket.onopen = () => {
    console.log("WebSocket connecté !");
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if(data.id && data.lat && data.lon){
        updateDevice(data.id, data.lat, data.lon);
    }
};

socket.onerror = (err) => {
    console.log("❌ WebSocket error", err);
};
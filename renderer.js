const map = L.map('map').setView([20,0], 2);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png').addTo(map);

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

const socket = new WebSocket('wss://gps-tracker.onrender.com'); // <-- URL Render

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if(data.id && data.lat && data.lon){
        updateDevice(data.id, data.lat, data.lon);
    }
};
const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 9090;
const TOKEN = "SECRET123";

// 🌐 Serveur HTTP (obligatoire pour Render)
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("✅ GPS Tracker server running");
});

// 🔌 WebSocket branché sur le serveur HTTP
const wss = new WebSocket.Server({ server });

console.log("🚀 Serveur lancé sur port", PORT);

wss.on('connection', ws => {
    console.log("📡 Appareil connecté");

    ws.on('message', message => {
        try {
            const data = JSON.parse(message.toString());

            if (data.token !== TOKEN) return;

            if (
                typeof data.id !== "string" ||
                typeof data.lat !== "number" ||
                typeof data.lon !== "number"
            ) return;

            // broadcast
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });

        } catch (err) {
            console.log("❌ erreur JSON");
        }
    });

    ws.on('close', () => {
        console.log("🔌 Déconnecté");
    });
});

server.listen(PORT);
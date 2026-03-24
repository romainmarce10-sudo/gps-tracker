const WebSocket = require('ws');

const PORT = 9090;
const TOKEN = "SECRET123";

const wss = new WebSocket.Server({ port: PORT });

console.log("✅ WebSocket lancé sur port", PORT);

wss.on('connection', ws => {
    console.log("📡 Appareil connecté");

    ws.on('message', message => {
        try {
            const data = JSON.parse(message.toString());

            // 🔐 Vérif token
            if (data.token !== TOKEN) {
                console.log("⛔ Token invalide");
                return;
            }

            // 🎯 Validation data
            if (
                typeof data.id !== "string" ||
                typeof data.lat !== "number" ||
                typeof data.lon !== "number"
            ) {
                console.log("⚠️ Données invalides");
                return;
            }

            // 📡 Broadcast à tous
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });

        } catch (err) {
            console.log("❌ Erreur JSON");
        }
    });

    ws.on('close', () => {
        console.log("🔌 Déconnexion");
    });
});
const WebSocket = require("ws");
module.exports = (wss) => {
  wss.on("connection", (ws) => {
    ws.on("message", (data) => {
      wss.clients.forEach((client) => {
        if (client != ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    });
  });
};

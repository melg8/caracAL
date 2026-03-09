const io = require("socket.io-client");

const HOST = "localhost";
const PORT = 7192;
const URL = `ws://${HOST}:${PORT}`;

console.log(`[test_connectivity] Starting connectivity test to ${URL}`);
console.log(`[test_connectivity] Date: ${new Date().toISOString()}`);

(async () => {
  const socket = io(URL, {
    autoConnect: false,
    path: "/socket.io/",
    query: {},
    reconnection: false,
    transports: ["websocket"],
    secure: false,
  }, false, false);

  // Connection lifecycle events
  socket.on("connect", function () {
    console.log(`[test_connectivity] ✓ Connected to server`);
    console.log(`[test_connectivity]   Socket ID: ${socket.id}`);
  });

  socket.on("connect_error", (err) => {
    console.error(`[test_connectivity] ✗ Connection error: ${err.message}`);
    console.error(`[test_connectivity]   Error type: ${err.type}`);
    if (err.description) {
      console.error(`[test_connectivity]   Description: ${err.description}`);
    }
  });

  socket.on("connect_timeout", () => {
    console.error(`[test_connectivity] ✗ Connection timeout after ${socket.io._opts.timeout}ms`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`[test_connectivity] Disconnected from server`);
    console.log(`[test_connectivity]   Reason: ${reason}`);
  });

  socket.on("reconnect_attempt", () => {
    console.log(`[test_connectivity] Attempting to reconnect...`);
  });

  socket.on("reconnect_error", (err) => {
    console.error(`[test_connectivity] Reconnection error: ${err.message}`);
  });

  socket.on("reconnect_failed", () => {
    console.error(`[test_connectivity] ✗ Reconnection failed`);
  });

  // Application events
  socket.on("welcome", (data) => {
    console.log(`[test_connectivity] ✓ Received 'welcome' event`);
    console.log(`[test_connectivity]   Keys: ${JSON.stringify(Object.keys(data))}`);
    console.log(`[test_connectivity]   Data: ${JSON.stringify(data, null, 2)}`);
  });

  socket.on("server_info", (data) => {
    console.log(`[test_connectivity] ✓ Received 'server_info' event`);
    console.log(`[test_connectivity]   Keys: ${JSON.stringify(Object.keys(data))}`);
    console.log(`[test_connectivity]   Data: ${JSON.stringify(data, null, 2)}`);
  });

  // Catch-all for any other events
  socket.onAny((event, ...args) => {
    if (!["connect", "connect_error", "connect_timeout", "disconnect", 
         "reconnect_attempt", "reconnect_error", "reconnect_failed", 
         "welcome", "server_info"].includes(event)) {
      console.log(`[test_connectivity] Received event '${event}':`, JSON.stringify(args, null, 2));
    }
  });

  console.log(`[test_connectivity] Initializing socket connection...`);
  socket.connect();
  console.log(`[test_connectivity] ✓ Socket initialized, waiting for events...`);

  // Keep the process running for a while to receive events
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.log(`[test_connectivity] Test completed after 10s timeout`);
  socket.disconnect();
  process.exit(0);

})().catch((e) => {
  console.error(`[test_connectivity] ✗ Exception: ${e}`);
  console.error(`[test_connectivity]   Stack: ${e.stack}`);
  process.exit(1);
});


// socketio called with: {
//   url: 'ws://localhost:7192',
//   options: {
//     autoConnect: false,
//     path: '/socket.io/',
//     query: {},
//     reconnection: false,
//     transports: [ 'websocket' ],
//     secure: false
//   },
//   reconnect: false,
//   start: false
// }

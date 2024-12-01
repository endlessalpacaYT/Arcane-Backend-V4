"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("../utils/logger"));
const app = (0, express_1.default)();
const port = 8080;
global.xmppDomain = "prod.ol.epicgames.com";
global.Clients = [];
global.MUCs = {};
const wss = new ws_1.Server({ server: app.listen(port) });
app.get("/", (req, res) => {
    res.type("application/json");
    const data = {
        Clients: {
            amount: global.Clients.length,
            clients: global.Clients.map(client => client.displayName),
        },
    };
    res.send(JSON.stringify(data, null, 2));
});
app.get("/clients", (req, res) => {
    res.type("application/json");
    const data = {
        amount: global.Clients.length,
        clients: global.Clients.map(client => client.displayName),
    };
    res.send(JSON.stringify(data, null, 2));
});
wss.on("connection", (ws) => {
    console.log("A new client connected.");
    ws.on("message", (message) => {
        console.log("Received:", message);
    });
    ws.on("close", () => {
        console.log("A client disconnected.");
    });
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});
wss.on("listening", () => {
    logger_1.default.xmpp(`XMPP started listening on port ${port}`);
});

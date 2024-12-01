import { Server as WebSocketServer, WebSocket } from "ws";
import { create as XMLBuilder } from "xmlbuilder";
import { parse as XMLParser } from "xml-parser";
import express, { Request, Response } from "express";

import logger from "../utils/logger";

const app = express();
const port = 8080;

declare global {
    var xmppDomain: string;
    var Clients: Array<{ displayName: string }>;
    var MUCs: Record<string, any>;
}

global.xmppDomain = "prod.ol.epicgames.com";
global.Clients = [];
global.MUCs = {};

const wss = new WebSocketServer({ server: app.listen(port) });

app.get("/", (req: Request, res: Response) => {
    res.type("application/json");

    const data = {
        Clients: {
            amount: global.Clients.length,
            clients: global.Clients.map(client => client.displayName),
        },
    };

    res.send(JSON.stringify(data, null, 2));
});

app.get("/clients", (req: Request, res: Response) => {
    res.type("application/json");

    const data = {
        amount: global.Clients.length,
        clients: global.Clients.map(client => client.displayName),
    };

    res.send(JSON.stringify(data, null, 2));
});

wss.on("connection", (ws: WebSocket) => {
    console.log("A new client connected.");
    ws.on("message", (message: Buffer) => {
        const decryptedMessage = message.toString();
        console.log("Received:", decryptedMessage);
    });

    ws.on("close", () => {
        console.log("A client disconnected.");
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});

wss.on("listening", () => {
    logger.xmpp(`XMPP started listening on port ${port}`);
});
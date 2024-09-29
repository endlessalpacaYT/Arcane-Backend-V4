const mongoose = require("mongoose");
const rateLimit = require('express-rate-limit');
const path = require('path');
const crypto = require("crypto");
const WebSocket = require('ws');
require("dotenv").config();;
const PORT = process.env.XMPP_MM_PORT || 80;

const GAME_SERVER_IP = process.env.GS_IP || '127.0.0.1';
const GAME_SERVER_PORT = process.env.GS_PORT || '7777';

let wss;

try {
    wss = new WebSocket.Server({
        host: process.env.XMPP_MM_IP || '127.0.0.1',  
        port: process.env.XMPP_MM_PORT || 80          
    });
}catch (err) {
    console.error("Unable To Start XMPP And Matchmaker Error: " + err);
}

wss.on('listening', () => {
    console.log(`XMPP And Matchmaker Started Listening On 127.0.0.1:${PORT}`);
});

wss.on('connection', async (ws) => {
    if (ws.protocol.toLowerCase().includes("xmpp")) {
        return ws.close();
    }

    const ticketId = crypto.createHash('md5').update(`1${Date.now()}`).digest('hex');
    const matchId = crypto.createHash('md5').update(`2${Date.now()}`).digest('hex');
    const sessionId = crypto.createHash('md5').update(`3${Date.now()}`).digest('hex');

    setTimeout(Connecting, 200);
    setTimeout(Waiting, 1000); 
    setTimeout(Queued, 2000); 
    setTimeout(SessionAssignment, 6000); 
    setTimeout(Join, 8000); 

    function Connecting() {
        ws.send(JSON.stringify({
            "payload": {
                "state": "Connecting"
            },
            "name": "StatusUpdate"
        }));
    }

    function Waiting() {
        ws.send(JSON.stringify({
            "payload": {
                "totalPlayers": 1,
                "connectedPlayers": 1,
                "state": "Waiting"
            },
            "name": "StatusUpdate"
        }));
    }

    function Queued() {
        ws.send(JSON.stringify({
            "payload": {
                "ticketId": ticketId,
                "queuedPlayers": 0,
                "estimatedWaitSec": 0,
                "status": {},
                "state": "Queued"
            },
            "name": "StatusUpdate"
        }));
    }

    function SessionAssignment() {
        ws.send(JSON.stringify({
            "payload": {
                "matchId": matchId,
                "state": "SessionAssignment"
            },
            "name": "StatusUpdate"
        }));
    }

    function Join() {
        ws.send(JSON.stringify({
            "payload": {
                "matchId": matchId,
                "sessionId": sessionId,
                "joinDelaySec": 1
            },
            "name": "Play"
        }));
    }
});
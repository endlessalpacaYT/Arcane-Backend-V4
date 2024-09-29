const fastify = require('fastify')();
const crypto = require("crypto");
require("dotenv").config();

let buildUniqueId = {};
let accountId;

const generateRandomID = () => {
    return crypto.randomBytes(16).toString("hex").toUpperCase();
};

const matchmaker = {
    matchmakerIP: process.env.MATCHMAKER_IP || "127.0.0.1",
    matchmakerPort: process.env.MATCHMAKER_PORT || "80"
};

console.log("Matchmaker IP Set To: " + process.env.MATCHMAKER_IP + ":" + process.env.MATCHMAKER_PORT);

module.exports = async function (fastify, options) {
    fastify.get("/fortnite/api/matchmaking/session/findPlayer/*", async (request, reply) => {
        reply.code(200).send();
    });
    
    fastify.get("/fortnite/api/game/v2/matchmakingservice/ticket/player/:accountId", async (request, reply) => {
        console.log("matchmaking started for a player");
    
        if (typeof request.query.bucketId !== "string") return reply.code(400).send();
        if (request.query.bucketId.split(":").length !== 4) return reply.code(400).send();
    
        accountId = request.params.accountId;
        buildUniqueId[accountId] = request.query.bucketId.split(":")[0];
    
        reply.send({
            "serviceUrl": `ws://${matchmaker.matchmakerIP}:${matchmaker.matchmakerPort}`,
            "ticketType": "mms-player",
            "payload": "69=", 
            "signature": "420="
        });
    });
    
    fastify.get("/fortnite/api/game/v2/matchmaking/account/:accountId/session/:sessionId", async (request, reply) => {
        reply.send({
            "accountId": request.params.accountId,
            "sessionId": request.params.sessionId,
            "key": "none"
        });
    });
    
    fastify.get("/fortnite/api/matchmaking/session/:sessionId", async (request, reply) => {
        const clientRegion = request.query.region || "EU";
        const gameServerInfo = {
            serverAddress: process.env.GS_IP || "127.0.0.1",
            serverPort: process.env.GS_PORT || 7777
        };
    
        reply.send({
            "id": request.params.sessionId,
            "ownerId": generateRandomID(),
            "ownerName": "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
            "serverName": "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
            "serverAddress": gameServerInfo.serverAddress,
            "serverPort": gameServerInfo.serverPort,
            "maxPublicPlayers": 220,
            "openPublicPlayers": 175,
            "maxPrivatePlayers": 0,
            "openPrivatePlayers": 0,
            "attributes": {
                "REGION_s": clientRegion,
                "GAMEMODE_s": "FORTATHENA",
                "ALLOWBROADCASTING_b": true,
                "SUBREGION_s": "GB",
                "DCID_s": "FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880",
                "tenant_s": "Fortnite",
                "MATCHMAKINGPOOL_s": "Any",
                "STORMSHIELDDEFENSETYPE_i": 0,
                "HOTFIXVERSION_i": 0,
                "PLAYLISTNAME_s": "Playlist_DefaultSolo",
                "SESSIONKEY_s": generateRandomID(),
                "TENANT_s": "Fortnite",
                "BEACONPORT_i": 15009
            },
            "publicPlayers": [],
            "privatePlayers": [],
            "totalPlayers": 45,
            "allowJoinInProgress": false,
            "shouldAdvertise": false,
            "isDedicated": false,
            "usesStats": false,
            "allowInvites": false,
            "usesPresence": false,
            "allowJoinViaPresence": true,
            "allowJoinViaPresenceFriendsOnly": false,
            "buildUniqueId": buildUniqueId[accountId] || "0",
            "lastUpdated": new Date().toISOString(),
            "started": false
        });
    });
    
    fastify.post("/fortnite/api/matchmaking/session/:sessionId/join", async (request, reply) => {
        reply.code(204).send();
    });    
    
    fastify.post("/fortnite/api/matchmaking/session/matchMakingRequest", async (request, reply) => {
        reply.send([]);
    });
}
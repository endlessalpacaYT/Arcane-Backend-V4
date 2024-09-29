module.exports = async function (fastify, options) {
    fastify.post("/fortnite/api/game/v2/chat/:gameMode/:accountId/:sessionId/pc", async (request, reply) => {
        const resp = { "GlobalChatRooms": [{ "roomName": "arcaneglobal" }] };
        reply.send(resp);
    });

    fastify.post("/fortnite/api/game/v2/tryPlayOnPlatform/account/:accountId", async (request, reply) => {
        reply.type("text/plain").send("true");
    });

    fastify.get("/launcher/api/public/distributionpoints", async (request, reply) => {
        reply.send({
            "distributions": [
                "https://download.epicgames.com/",
                "https://download2.epicgames.com/",
                "https://download3.epicgames.com/",
                "https://download4.epicgames.com/",
                "https://epicgames-download1.akamaized.net/"
            ]
        });
    });

    fastify.get("/waitingroom/api/waitingroom", async (request, reply) => {
        reply.code(204).send();
    });

    fastify.get("/fortnite/api/game/v2/events/tournamentandhistory/:accountId/:region/WindowsClient", async (request, reply) => {
        reply.send({});
    });

    fastify.get("/fortnite/api/statsv2/account/:accountId", async (request, reply) => {
        reply.send({
            "startTime": 0,
            "endTime": 0,
            "stats": {},
            "accountId": request.params.accountId
        });
    });

    fastify.get("/statsproxy/api/statsv2/account/:accountId", async (request, reply) => {
        reply.send({
            "startTime": 0,
            "endTime": 0,
            "stats": {},
            "accountId": request.params.accountId
        });
    });

    fastify.get("/fortnite/api/stats/accountId/:accountId/bulk/window/alltime", async (request, reply) => {
        reply.send({
            "startTime": 0,
            "endTime": 0,
            "stats": {},
            "accountId": request.params.accountId
        });
    });

    fastify.get('/fortnite/api/statsv2/leaderboards/:leaderboardId', async (request, reply) => {
        const { leaderboardId } = request.params;

        return reply.code(200).send({
            leaderboardId: leaderboardId,
            entries: [], 
            totalSize: 0
        });
    });

    fastify.post("/fortnite/api/feedback/:feedbackId", async (request, reply) => {
        reply.code(200).send();
    });

    fastify.post("/fortnite/api/statsv2/query", async (request, reply) => {
        reply.send([]);
    });

    fastify.post("/statsproxy/api/statsv2/query", async (request, reply) => {
        reply.send([]);
    });

    fastify.post("/fortnite/api/game/v2/events/v2/setSubgroup/:subgroupId", async (request, reply) => {
        reply.code(204).send();
    });

    fastify.get("/api/v1/events/Fortnite/download/:eventId", async (request, reply) => {
        reply.send({});
    });

    fastify.get("/fortnite/api/game/v2/twitch/:accountId", async (request, reply) => {
        reply.code(200).send();
    });

    fastify.get("/fortnite/api/game/v2/world/info", async (request, reply) => {
        reply.send({});
    });

    fastify.post("/fortnite/api/game/v2/chat/:gameMode/recommendGeneralChatRooms/pc", async (request, reply) => {
        reply.send({});
    });

    fastify.get("/fortnite/api/receipts/v1/account/:accountId/receipts", async (request, reply) => {
        reply.send([]);
    });

    fastify.get("/fortnite/api/game/v2/leaderboards/cohort/:cohortId", async (request, reply) => {
        reply.send([]);
    });
};
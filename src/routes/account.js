module.exports = async function (fastify, options) {
    // will add database for this soon, but i need to understand the banning system more first
    
    fastify.get("/socialban/api/public/v1/:accountId", async (request, reply) => {
        reply.send({
            "bans": [],
            "warnings": []
        });
    });

    fastify.get("/socialban/api/public/v1/:accountId/ban", async (request, reply) => {
        reply.send({
            "bans": [],
            "warnings": []
        });
    });

    fastify.get("/content-controls/:accountId", async (request, reply) => {
        reply.send({
            "accountId": ":accountId",
            "parentalControls": {
                "enabled": false
            }
        });
    });
}
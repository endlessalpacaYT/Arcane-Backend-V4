const contentpages = require("../responses/contentpages.json");

module.exports = async function (fastify, options) {
    fastify.get('/content/api/pages/fortnite-game', async (request, reply) => {
        return reply.code(200).send(contentpages);
    });
}
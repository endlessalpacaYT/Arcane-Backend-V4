module.exports = async function (fastify, options) {
    fastify.get('/fortnite/api/v2/versioncheck/Windows', async (request, reply) => {
        return reply.code(200).send({
          "type": "NO_UPDATE", 
          "version": "0.0.0"
        });
    });
}
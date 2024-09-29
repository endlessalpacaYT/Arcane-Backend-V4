const crypto = require('crypto');

module.exports = async function (fastify, options) {
    fastify.get('/party/api/v1/Fortnite/user/:accountId', async (request, reply) => {
        const { accountId } = request.params;

        const partyId = crypto.randomBytes(32).toString('hex');
        
        return reply.code(200).send({
            "accountId": accountId,
            "partyStatus": "ONLINE",
            "partyId": partyId,
            "isLeader": true,
            "inParty": true
        })
    })

    fastify.get('/party/api/v1/Fortnite/user/:accountId/notifications/undelivered/count', async (request, reply) => {
        return reply.code(200).send({
            "undeliveredCount": 0
        })
    })
}
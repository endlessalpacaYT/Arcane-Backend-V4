const BlockList = require("../Models/friends/blocklist");

module.exports = async function (fastify, options) {
    fastify.get('/friends/api/public/blocklist/:accountId', async (request, reply) => {
        const { accountId } = request.params;
        
        let blocklist = await BlockList.findOne({ accountId: accountId });
        
        if (!blocklist) {
            blocklist = new BlockList({
                accountId: accountId,
                blocklist: []
            });
            await blocklist.save();
        }

        return reply.code(200).send({
            blocklist: blocklist.blocklist || []
        });
    });

    fastify.get('/friends/api/public/friends/:accountId', async (request, reply) => {
        const { accountId } = request.params;
        const includePending = request.query.includePending || false;
    
        return reply.code(200).send({
            friends: [],
            incoming: includePending ? [] : [], 
            outgoing: includePending ? [] : []
        });
    });

    fastify.get('/friends/api/public/list/fortnite/:accountId/recentPlayers', async (request, reply) => {
        return reply.code(200).send({
            "recentPlayers": []
        });
    });

    fastify.get('/friends/api/v1/:accountId/settings', async (request, reply) => {
        return reply.code(200).send({
            "acceptInvites": "ALL",
            "showPresence": true,
            "allowJoinViaPresence": true,
            "allowFriendInvites": true,
            "autoAddFriends": false
        });
    });
}
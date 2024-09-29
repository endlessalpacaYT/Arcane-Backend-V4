const User = require('../Models/user/user.js');
const UserV2 = require('../Models/user/userv2.js');

module.exports = async function (fastify, options) {
    fastify.get("/account/api/public/account/displayName/:displayName", async (request, reply) => {
        let user = await UserV2.findOne({ Username: request.params.displayName, Banned: false }).lean() || 
                   await User.findOne({ username: request.params.displayName, banned: false }).lean();
        
        if (!user) {
            console.error("Could Not Find User, DisplayName: " + request.params.displayName);
            return reply.code(404).send({
                errorCode: "arcane.errors.user.not_found",
                errorMessage: `Sorry, we couldn't find an account for ${request.params.displayName}`
            });
        }
    
        return reply.code(200).send({
          id: user.accountId,
          displayName: user.username,
          externalAuths: {}
        });
    });
};
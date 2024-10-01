const mongoose = require("mongoose");

const User = require('../database/mongodb/Models/user/user.js');
const UserV2 = require('../database/mongodb/Models/user/userv2.js');
const BattlePass = require('../database/mongodb/Models/profile/BattlePass.js');

const athena = require("../responses/DefaultProfiles/athena.json");
const account = require("./account.js");

const Profile = require("../database/mongodb/Models/profile/profile.js");
const { createProfiles, validateProfile } = require("../utils/profile.js")

module.exports = async function (fastify, options) {
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/PurchaseCatalogEntry', async (request, reply) => {
        const { accountId } = request.params;
        const { offerId, price } = request.body;

        const battlePassOfferId = 'BATTLEPASS_OFFER_ID';
        const battlePassPrice = 950;

        if (offerId !== battlePassOfferId) {
            return reply.code(404).send({
                errorCode: "arcane.errors.offer_not_found",
                errorMessage: "The requested offer was not found",
                numericErrorCode: 16036
            });
        }

        if (price !== battlePassPrice) {
            return reply.code(400).send({
                errorCode: "arcane.errors.invalid_price",
                errorMessage: `The price is invalid. Expected price: ${battlePassPrice}`,
                numericErrorCode: 16037
            });
        }

        let battlePass = await BattlePass.findOne({ accountId: accountId });
        if (!battlePass) {
            battlePass = new BattlePass({ accountId: accountId });
            await battlePass.save();
        }

        battlePass.unlocked = true;
        await battlePass.save();
        return reply.code(200).send({
            "profileChanges": [
                {
                    "changeType": "itemAdded",
                    "itemId": offerId,
                    "item": {
                        "templateId": "BattlePass",
                        "attributes": {
                            "battlePassPurchased": true,
                            "battlePassTier": 1,
                            "purchaseDate": new Date().toISOString()
                        }
                    }
                }
            ],
            "profileRevision": 1,
            "serverTime": new Date().toISOString(),
            "responseVersion": 1
        });
    });
    
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/QueryProfile', async (request, reply) => {
        const { accountId } = request.params;
        const { profileId } = request.query;

        let profile = await Profile.findOne({ accountId });

        if (!profile) {
            const newProfiles = createProfiles(accountId);
            profile = new Profile({
                accountId: accountId,
                profileId: accountId,  
                profiles: newProfiles
            });

            await profile.save(); 
        }

        if (!await validateProfile(profileId, profile)) {
            return reply.code(404).send({
                error: "arcane.errors.profile_not_found",
                error_description: "The profile you requested does not exist"
            });
        }

        return reply.code(200).send(profile.profiles[profileId]);
    });
    
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/SetCosmeticLoadout', async (request, reply) => {
        const { accountId } = request.params;
        const { bannerIcon, bannerColor } = request.body || {};
    
        return reply.code(200).send(athena);
    });
}
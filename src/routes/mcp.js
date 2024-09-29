// quick note: idek what mcp is for i just put miscellaneous routes in there!!!!!

const keychain = require("./../responses/keychain.json");

module.exports = async function (fastify, options) {
    fastify.post('/datarouter/api/v1/public/data', async (request, reply) => {
        return reply.code(200).send({ message: 'Data received' });
    });

    fastify.post('/api/v1/user/setting', async (request, reply) => {
        return reply.code(200).send({ message: "User settings updated" });
    }); 
    
    fastify.get('/fortnite/api/game/v2/enabled_features', async (request, reply) => {
        return reply.code(200).send([]);
    }); 
    
    fastify.post("/fortnite/api/game/v2/tryPlayOnPlatform/account/*", async (request, reply) => {
        reply.header("Content-Type", "text/plain"); 
        return reply.send('true'); 
    }); 
    
    fastify.post('/fortnite/api/game/v2/grant_access/:accountId', async (request, reply) => {
        reply.header("Content-Type", "text/plain"); 
        return reply.send('true');
    });

    fastify.get("/fortnite/api/storefront/v2/keychain", async (request, reply) => {
        return reply.code(200).send(keychain);  
    });

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/SetMtxPlatform', async (request, reply) => {
        return reply.code(200).send({
          status: 'MTX Platform Set',
          profileId: request.query.profileId
        });
    });

    fastify.get("/fortnite/api/storefront/v2/catalog", async (request, reply) => {
        const catalogResponse = {
            "refreshIntervalHrs": 1,
            "dailyPurchaseHrs": 24,
            "expiration": new Date(Date.now() + 86400 * 1000).toISOString(),
            "storefronts": [
                {
                    "name": "BATTLEPASS",
                    "catalogEntries": [
                        {
                            "offerId": "BATTLEPASS_OFFER_ID",
                            "devName": "Battle Pass",
                            "offerType": "StaticPrice",
                            "prices": [
                                {
                                    "currencyType": "MtxCurrency",
                                    "currencySubType": "",
                                    "regularPrice": 950,
                                    "finalPrice": 950
                                }
                            ],
                            "categories": ["BATTLEPASS"],
                            "meta": {
                                "NewDisplayAssetPath": "BattlePass",
                                "NewBanner": {
                                    "value": "BP",
                                    "intensity": "High"
                                },
                                "NewOfferText": "Unlock the Battle Pass"
                            },
                            "giftInfo": {
                                "bIsEnabled": false
                            },
                            "refundable": true
                        }
                    ]
                }
            ]
        };

        return reply.code(200).send(catalogResponse);
    });  

    fastify.get('/content-controls/:accountId/rules/namespaces/fn', async (request, reply) => {
        const { accountId } = request.params;
    
        return reply.code(200).send({
            "accountId": accountId,
            "namespace": "fn",
            "rules": []
        });
    });    
}
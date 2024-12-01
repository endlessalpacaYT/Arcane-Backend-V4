import { FastifyInstance } from 'fastify';
import fs from "fs";
import path from "path";
import crypto from "crypto";

const keychain = require("../responses/keychain.json")

export async function storefrontRoutes(fastify: FastifyInstance) {
    fastify.get('/fortnite/api/storefront/v2/keychain', (request, reply) => {
        return reply.status(200).send(keychain);
    })

    fastify.get('/fortnite/api/storefront/v2/catalog', (request, reply) => {
        const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "responses", "Shop", "catalog.json")).toString());
        const CatalogConfig = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "..", "responses", "Shop", "catalog_config.json"),
                "utf8"
            )
        );

        try {
            for (let value in CatalogConfig) {
                if (!Array.isArray(CatalogConfig[value].itemGrants)) continue;
                if (CatalogConfig[value].itemGrants.length == 0) continue;

                const CatalogEntry = { "devName": "", "offerId": "", "fulfillmentIds": [], "dailyLimit": -1, "weeklyLimit": -1, "monthlyLimit": -1, "categories": [], "prices": [{ "currencyType": "MtxCurrency", "currencySubType": "", "regularPrice": 0, "finalPrice": 0, "saleExpiration": "9999-12-02T01:12:00Z", "basePrice": 0 }], "meta": { "SectionId": "Featured", "TileSize": "Small" }, "matchFilter": "", "filterWeight": 0, "appStoreId": [], "requirements": [], "offerType": "StaticPrice", "giftInfo": { "bIsEnabled": true, "forcedGiftBoxTemplateId": "", "purchaseRequirements": [], "giftRecordIds": [] }, "refundable": false, "metaInfo": [{ "key": "SectionId", "value": "Featured" }, { "key": "TileSize", "value": "Small" }], "displayAssetPath": "", "itemGrants": [], "sortPriority": 0, "catalogGroupPriority": 0 };

                let i = catalog.storefronts.findIndex(p => p.name == (value.toLowerCase().startsWith("daily") ? "BRDailyStorefront" : "BRWeeklyStorefront"));
                if (i == -1) continue;

                if (value.toLowerCase().startsWith("daily")) {
                    CatalogEntry.sortPriority = -1;
                } else {
                    CatalogEntry.meta.TileSize = "Normal";
                    CatalogEntry.metaInfo[1].value = "Normal";
                }

                for (let itemGrant of CatalogConfig[value].itemGrants) {
                    if (typeof itemGrant != "string") continue;
                    if (itemGrant.length == 0) continue;

                    CatalogEntry.requirements.push({ "requirementType": "DenyOnItemOwnership", "requiredId": itemGrant, "minQuantity": 1 });
                    CatalogEntry.itemGrants.push({ "templateId": itemGrant, "quantity": 1 });
                }

                CatalogEntry.prices = [{
                    "currencyType": "MtxCurrency",
                    "currencySubType": "",
                    "regularPrice": CatalogConfig[value].price,
                    "finalPrice": CatalogConfig[value].price,
                    "saleExpiration": "9999-12-02T01:12:00Z",
                    "basePrice": CatalogConfig[value].price
                }];

                if (CatalogEntry.itemGrants.length > 0) {
                    let uniqueIdentifier = crypto.createHash("sha1").update(`${JSON.stringify(CatalogConfig[value].itemGrants)}_${CatalogConfig[value].price}`).digest("hex");

                    CatalogEntry.devName = uniqueIdentifier;
                    CatalogEntry.offerId = uniqueIdentifier;

                    catalog.storefronts[i].catalogEntries.push(CatalogEntry);
                }
            }
        } catch { }

        return reply.status(200).send(catalog)
    })
}
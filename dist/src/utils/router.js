"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../routes/auth");
const account_1 = require("../routes/account");
const mcp_1 = require("../routes/mcp");
const storefront_1 = require("../routes/storefront");
const default_1 = require("../routes/default");
const datarouter_1 = require("../routes/datarouter");
const feedback_1 = require("../routes/feedback");
const version_1 = require("../routes/version");
const cloudstorage_1 = require("../routes/cloudstorage");
const lightswitch_1 = require("../routes/lightswitch");
const party_1 = require("../routes/party");
const friends_1 = require("../routes/friends");
const stats_1 = require("../routes/stats");
const event_1 = require("../routes/event");
const content_1 = require("../routes/content");
const receipts_1 = require("../routes/receipts");
const waitingroom_1 = require("../routes/waitingroom");
function registerRoutes(fastify) {
    (0, default_1.defaultRoutes)(fastify);
    (0, auth_1.authRoutes)(fastify);
    (0, account_1.accountRoutes)(fastify);
    (0, mcp_1.mcpRoutes)(fastify);
    (0, storefront_1.storefrontRoutes)(fastify);
    (0, datarouter_1.dataRoutes)(fastify);
    (0, feedback_1.feedbackRoutes)(fastify);
    (0, version_1.versionRoutes)(fastify);
    (0, cloudstorage_1.cloudstorageRoutes)(fastify);
    (0, lightswitch_1.lightswitchRoutes)(fastify);
    (0, party_1.partyRoutes)(fastify);
    (0, friends_1.friendRoutes)(fastify);
    (0, stats_1.statsRoutes)(fastify);
    (0, event_1.eventRoutes)(fastify);
    (0, content_1.contentRoutes)(fastify);
    (0, receipts_1.receiptRoutes)(fastify);
    (0, waitingroom_1.waitingroom)(fastify);
}
exports.default = {
    registerRoutes
};

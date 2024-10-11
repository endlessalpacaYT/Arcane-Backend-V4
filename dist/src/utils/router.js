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
}
exports.default = {
    registerRoutes
};

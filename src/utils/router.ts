import { FastifyInstance } from 'fastify';

import { authRoutes } from '../routes/auth';
import { accountRoutes } from '../routes/account';
import { mcpRoutes } from '../routes/mcp';
import { storefrontRoutes } from '../routes/storefront';
import { defaultRoutes } from '../routes/default';
import { dataRoutes } from '../routes/datarouter';
import { feedbackRoutes } from '../routes/feedback';
import { versionRoutes } from '../routes/version';
import { cloudstorageRoutes } from '../routes/cloudstorage';
import { lightswitchRoutes } from '../routes/lightswitch';

function registerRoutes(fastify: FastifyInstance) {
    defaultRoutes(fastify)
    authRoutes(fastify);
    accountRoutes(fastify);
    mcpRoutes(fastify);
    storefrontRoutes(fastify);
    dataRoutes(fastify);
    feedbackRoutes(fastify);
    versionRoutes(fastify);
    cloudstorageRoutes(fastify);
    lightswitchRoutes(fastify);
}

export default {
    registerRoutes
}
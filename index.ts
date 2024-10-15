import { warn } from 'console';
import Fastify from 'fastify';
import mongoose from 'mongoose';
import formbody from '@fastify/formbody';
import logger from "./src/utils/logger";
require("dotenv").config();

import router from "./src/utils/router";
import database from "./src/database/connect";
import discord from "./src/discord/index";

const fastify = Fastify({ logger: { level: 'warn' } });

const IP = process.env.IP || "0.0.0.0";
const PORT = process.env.PORT || 3551;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ArcaneV4";

fastify.register(formbody);

fastify.addHook('onResponse', async (request, reply) => {
    if (reply.statusCode >= 400) {
      fastify.log.info(`Response with status code: ${reply.statusCode} for ${request.method} ${request.url}`);
    }
});

fastify.setNotFoundHandler((request, reply) => {
    console.log(`404 Not Found: ${request.method} : ${request.url}`);
    reply
      .status(404)
      .send({
        error: 'arcane.errors.common.not_found',
        message: 'The route you requested is either unavailable or missing!',
        code: 404
      });
});

router.registerRoutes(fastify);

function startHTTPServer() {
    try {
        fastify.listen({ port: Number(PORT), host: IP });
        logger.backend(`Arcane Listening On: http://${IP}:${PORT}`);
      } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

async function startBackend() {
    startHTTPServer();
    await database.connectDB(MONGO_URI);
    if (process.env.BOT_ENABLED == "true") {
        discord();
    }
}

startBackend();
import { warn } from 'console';
import Fastify from 'fastify';
import formbody from '@fastify/formbody';

import router from "./src/utils/router";

const fastify = Fastify({ logger: { level: 'warn' } });

const IP = "0.0.0.0";
const PORT = 3551;

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
        fastify.listen({ port: PORT, host: IP });
        console.log(`Arcane Listening On: http://${IP}:${PORT}`);
      } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

function startBackend() {
    startHTTPServer();
}

startBackend();
import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

const IP = "0.0.0.0";
const PORT = 3551;

fastify.addHook('onResponse', async (request, reply) => {
    if (reply.statusCode >= 400) {
      fastify.log.info(`Response with status code: ${reply.statusCode} for ${request.method} ${request.url}`);
    }
});

fastify.get('/', async (request, reply) => {
  return {
    backend: "ArcaneBackendV4"
  };
});

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
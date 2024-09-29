const fastify = require('fastify')({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname,reqId,res,responseTime'
        }
      },
      serializers: {
        req: (req) => ({
          method: req.method,
          url: req.url,
        }),
        res: (res) => ({
          statusCode: res.statusCode,
        })
      },
      level: 'error' 
    }
});

const mongoose = require("mongoose");
require("dotenv").config();

const IP = process.env.IP || "0.0.0.0";
const PORT = process.env.PORT || 3551; 

fastify.addHook('onResponse', (request, reply, done) => {
    fastify.log.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode
    });
    done();
});

fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
    if (body === '') {
      done(null, null);
    } else {
      try {
        const json = JSON.parse(body);
        done(null, json);
      } catch (err) {
        done(err);
      }
    }
  });

fastify.register(require('@fastify/formbody'));

fastify.register(require('./src/routes/auth'));
fastify.register(require('./src/routes/cloudstorage'));
fastify.register(require('./src/routes/profiles'));
fastify.register(require('./src/routes/user'));
fastify.register(require('./src/routes/main'));
fastify.register(require('./src/routes/mcp'));
fastify.register(require('./src/routes/matchmaker'));
fastify.register(require('./src/routes/battlepass'));
fastify.register(require('./src/responses/athena'));
fastify.register(require('./src/routes/account'));
fastify.register(require('./src/routes/friends'));
fastify.register(require('./src/routes/party'));
fastify.register(require('./src/routes/version'));
fastify.register(require('./src/routes/contentpages'));
fastify.register(require('./src/routes/timeline'));
fastify.register(require('./src/routes/lightswitch'));

fastify.get('/', async (request, reply) => {
    return { message: 'ArcaneBackendV2' };
});

fastify.setNotFoundHandler(function (request, reply) {
  fastify.log.error({
    method: request.method,
    url: request.url,
    message: 'Route not found',
    statusCode: 404
  });
  reply.code(404).send({ error: 'Route not found' });
});

fastify.setErrorHandler(function (error, request, reply) {
  const statusCode = reply.statusCode >= 400 ? reply.statusCode : 500;
  fastify.log.error({
    method: request.method,
    url: request.url,
    errorMessage: error.message,
    statusCode: statusCode
  });

  reply.code(statusCode).send({
    error: error.message || 'Internal Server Error',
    statusCode: statusCode
  });
});

async function initDB() {
    const mongoDB = process.env.MONGODB || "mongodb://127.0.0.1/ArcaneV3";
    try {
        await mongoose.connect(mongoDB);
        console.log("MongoDB connected successfully to: " + mongoDB);
    } catch (err) {
        console.error("MongoDB connection error:", err);
        console.log("Closing in 5 seconds...");
        setTimeout(() => process.exit(1), 5000); 
    }
}

async function startMain() {
    try {
        await fastify.listen({ port: PORT, host: IP });
        console.log('ArcaneV4 is running on http://localhost:' + PORT);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

function startBackend() {
    console.log("ArcaneV4 Is Starting");
    startMain();
    initDB();
    require("./src/discord/index.js");
    require("./src/xmpp/xmpp.js");
    require("./src/api/index.js");
}

startBackend();
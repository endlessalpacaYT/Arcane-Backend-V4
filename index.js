const fastify = require("fastify");
require("dotenv").config();

const app = fastify();
const PORT = process.env.PORT || 3551
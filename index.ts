import fastify from "fastify";
import { Pool } from 'pg';
import dotenv from 'dotenv';

const app = fastify();
dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);

import auth from './routes/auth';

app.addHook('onResponse', (request, reply, done) => {
    const statusCode = reply.statusCode;
    if (statusCode >= 400) {
        console.error(`Request to ${request.raw.url} failed with status code ${statusCode}`);
    }
    done();
});

app.register(auth);

app.get('/', (request, reply) => {
    reply.status(200).send({
        backend: "ArcaneV4",
        description: "A Universal Backend For Old Builds Of Fortnite, This Is The Last One! Aiming To Be 1:1!",
        version: process.env.VERSION || "VERSION_NOT_FOUND"
    })
})

const pool = new Pool({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT || '5432', 10),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});

pool.on('connect', () => {
    console.log(`PostgreSQL Connected To: ${process.env.PG_HOST}:${process.env.PG_PORT}`);
});

pool.on('error', (err) => {
    console.error('Error Connecting To PostgreSQL: ' + err);
});

pool.connect()

app.listen({ port: PORT }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`ArcaneV4 [Version: ${process.env.VERSION}] Listening On ${address}`);
});
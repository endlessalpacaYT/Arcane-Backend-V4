import fastify from "fastify";
import dotenv from 'dotenv';

const app = fastify();
dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);

app.get('/', (request, reply) => {
    reply.status(200).send({
        backend: "ArcaneV4",
        description: "A Universal Backend For Old Builds Of Fortnite, This Is The Last One! Aiming To Be 1:1!",
        version: "0.01"
    })
})

app.listen({ port: PORT }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`ArcaneV4 Listening On ${address}`);
});
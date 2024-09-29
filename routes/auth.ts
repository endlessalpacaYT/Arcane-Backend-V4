import { FastifyInstance } from 'fastify';

export default async function authRoutes(app: FastifyInstance) {
    app.post('/account/api/oauth/token', async (request, Response) => {
        Response.status(200).send({
            message: "placeholder"
        })
    })

    app.post('/account/api/oauth/verify', async (request, Response) => {
        Response.status(200).send({
            message: "placeholder"
        })
    })
}
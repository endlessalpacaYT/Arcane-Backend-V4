"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendRoutes = friendRoutes;
function friendRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get('/friends/api/v1/:accountId/blocklist', (request, reply) => {
            return reply.status(200).send([]);
        });
        fastify.get('/friends/api/public/blocklist/:accountId', (request, reply) => {
            return reply.status(200).send([]);
        });
        fastify.get('/friends/api/v1/:accountId/summary', (request, reply) => {
            return reply.status(200).send([]);
        });
        fastify.get('/friends/api/public/friends/:accountId', (request, reply) => {
            return reply.status(200).send([]);
        });
        fastify.get('/friends/api/v1/:accountId/recent/fortnite', (request, reply) => {
            return reply.status(200).send([]);
        });
        fastify.get('/friends/api/v1/:accountId/settings', (request, reply) => {
            return reply.status(200).send([]);
        });
    });
}

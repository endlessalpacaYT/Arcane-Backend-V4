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
exports.partyRoutes = partyRoutes;
function partyRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get('/party/api/v1/Fortnite/user/:accountId', (request, reply) => {
            return reply.status(200).send({
                status: "OK",
                code: 200
            });
        });
        fastify.get('/party/api/v1/Fortnite/user/:accountId/notifications/undelivered/count', (request, reply) => {
            return reply.status(200).send([]);
        });
    });
}

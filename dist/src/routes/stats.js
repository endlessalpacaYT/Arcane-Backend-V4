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
exports.statsRoutes = statsRoutes;
function statsRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get("/fortnite/api/statsv2/account/:accountId", (request, reply) => {
            reply.status(200).send({
                "startTime": 0,
                "endTime": 0,
                "stats": {},
                "accountId": request.params.accountId
            });
        });
        fastify.get("/statsproxy/api/statsv2/account/:accountId", (request, reply) => {
            reply.status(200).send({
                "startTime": 0,
                "endTime": 0,
                "stats": {},
                "accountId": request.params.accountId
            });
        });
        fastify.get("/fortnite/api/stats/accountId/:accountId/bulk/window/alltime", (request, reply) => {
            reply.status(200).send({
                "startTime": 0,
                "endTime": 0,
                "stats": {},
                "accountId": request.params.accountId
            });
        });
    });
}

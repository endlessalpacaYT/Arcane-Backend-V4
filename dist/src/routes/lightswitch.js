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
exports.lightswitchRoutes = lightswitchRoutes;
function lightswitchRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get("/lightswitch/api/service/Fortnite/status", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            return reply.status(200).send({
                "serviceInstanceId": "fortnite",
                "status": "UP",
                "message": "Fortnite is online",
                "maintenanceUri": null,
                "overrideCatalogIds": [
                    "a7f138b2e51945ffbfdacc1af0541053"
                ],
                "allowedActions": [],
                "banned": false,
                "launcherInfoDTO": {
                    "appName": "Fortnite",
                    "catalogItemId": "4fe75bbc5a674f4f9b356b5c90567da5",
                    "namespace": "fn"
                }
            });
        }));
        fastify.get("/lightswitch/api/service/bulk/status", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            return reply.status(200).send([{
                    "serviceInstanceId": "fortnite",
                    "status": "UP",
                    "message": "fortnite is up.",
                    "maintenanceUri": null,
                    "overrideCatalogIds": [
                        "a7f138b2e51945ffbfdacc1af0541053"
                    ],
                    "allowedActions": [
                        "PLAY",
                        "DOWNLOAD"
                    ],
                    "banned": false,
                    "launcherInfoDTO": {
                        "appName": "Fortnite",
                        "catalogItemId": "4fe75bbc5a674f4f9b356b5c90567da5",
                        "namespace": "fn"
                    }
                }]);
        }));
    });
}

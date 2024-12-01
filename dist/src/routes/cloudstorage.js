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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudstorageRoutes = cloudstorageRoutes;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
function cloudstorageRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get('/fortnite/api/cloudstorage/system', (request, reply) => {
            const dir = path_1.default.join(__dirname, "..", "CloudStorage");
            let CloudFiles = [];
            fs_1.default.readdirSync(dir).forEach(name => {
                if (name.toLowerCase().endsWith(".ini")) {
                    const ParsedFile = fs_1.default.readFileSync(path_1.default.join(dir, name)).toString();
                    const ParsedStats = fs_1.default.statSync(path_1.default.join(dir, name));
                    CloudFiles.push({
                        "uniqueFilename": name,
                        "filename": name,
                        "hash": crypto_1.default.createHash('sha1').update(ParsedFile).digest('hex'),
                        "hash256": crypto_1.default.createHash('sha256').update(ParsedFile).digest('hex'),
                        "length": ParsedFile.length,
                        "contentType": "application/octet-stream",
                        "uploaded": ParsedStats.mtime,
                        "storageType": "S3",
                        "storageIds": {},
                        "doNotCache": true
                    });
                }
            });
            reply.status(200).send(CloudFiles);
        });
        fastify.get("/fortnite/api/cloudstorage/system/:file", (request, reply) => {
            const file = path_1.default.join(__dirname, "..", "CloudStorage", path_1.default.basename(request.params.file));
            if (fs_1.default.existsSync(file))
                return reply.status(200).send(fs_1.default.readFileSync(file));
            reply.status(200);
        });
        fastify.get('/fortnite/api/cloudstorage/user/:accountId', (request, reply) => {
            return reply.status(200).send({
                status: "OK",
                code: 200
            });
        });
        fastify.put('/fortnite/api/cloudstorage/user/:accountId/:fileName', (request, reply) => {
            return reply.status(200).send({
                status: "OK",
                code: 200
            });
        });
    });
}

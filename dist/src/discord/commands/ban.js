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
const discord_js_1 = require("discord.js");
const discord_js_2 = require("discord.js");
const user_1 = __importDefault(require("../../database/models/user"));
require("dotenv").config();
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban someone from ArcaneV4!")
        .addStringOption(option => option.setName("username")
        .setDescription("Who do you want to ban?")
        .setRequired(true))
        .addStringOption(option => option.setName("reason")
        .setDescription("Why do you want to ban that user?")
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const reason = interaction.options.getString('reason');
                const user = yield user_1.default.findOne({ username_lower: (_a = interaction.options.getString('username')) === null || _a === void 0 ? void 0 : _a.toLowerCase() });
                if (!user) {
                    const embed = new discord_js_2.EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle("Failed to ban user")
                        .setDescription("Reason: Couldn't find the user you were trying to ban.");
                    yield interaction.reply({ embeds: [embed], ephemeral: true });
                    return;
                }
                else if (user.banned) {
                    const embed = new discord_js_2.EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle("Failed to ban user")
                        .setDescription("Reason: The user you were trying to ban is allready banned!");
                    yield interaction.reply({ embeds: [embed], ephemeral: true });
                }
                yield user.updateOne({ $set: { banned: true } });
                const embed = new discord_js_2.EmbedBuilder()
                    .setColor("#a600ff")
                    .setTitle("Someone got hit with the Ban Hammer")
                    .addFields({
                    name: "Username",
                    value: user.username,
                    inline: true
                }, {
                    name: "Reason",
                    value: reason || "No reason provided",
                    inline: false
                });
                if (process.env.BAN_EMBED_ENABLED === "true") {
                    const channelId = process.env.BAN_EMBED_CHANNELID;
                    if (typeof channelId === 'string') {
                        const banChannel = interaction.client.channels.cache.get(channelId);
                        if (banChannel && banChannel.isTextBased()) {
                            yield banChannel.send({ embeds: [embed] });
                        }
                        else {
                            console.log(`Could not find text-based channel with the ID: ${channelId}`);
                        }
                    }
                }
                yield interaction.reply({ content: `Successfully banned ${user.username}!`, ephemeral: true });
            }
            catch (error) {
                console.error("Error executing the ban command:", error);
                yield interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        });
    }
};

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
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("lookup")
        .setDescription("Lookup another user")
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
        .addUserOption((option) => option
        .setName("user")
        .setDescription("Select the user you want to lookup.")
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield user_1.default.findOne({
                    discordId: (_a = interaction.options.getUser("user")) === null || _a === void 0 ? void 0 : _a.id,
                });
                if (!user) {
                    const embed = new discord_js_2.EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle("Failed To lookup that user")
                        .setDescription("Reason: that user doesent have an account!");
                    yield interaction.reply({ embeds: [embed], ephemeral: true });
                    return;
                }
                const embed = new discord_js_2.EmbedBuilder()
                    .setColor("#a600ff")
                    .setTitle("User lookup")
                    .addFields({
                    name: "Created",
                    value: new Date(user.created).toLocaleDateString(),
                    inline: true,
                }, {
                    name: "Banned",
                    value: user.banned ? "🔴 Yes" : "🟢 No",
                    inline: false,
                }, {
                    name: "Account ID",
                    value: `\`${user.accountId}\``,
                    inline: false,
                }, {
                    name: "Username",
                    value: user.username,
                    inline: false,
                });
                yield interaction.reply({ embeds: [embed], ephemeral: true });
            }
            catch (error) {
                console.error("Error executing the lookup command:", error);
                yield interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        });
    },
};

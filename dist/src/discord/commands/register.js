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
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("register")
        .setDescription("Create An Account On ArcaneV4!")
        .addStringOption(option => option.setName("username")
        .setDescription("What Do You Want Your Ingame Username To Be?")
        .setRequired(true))
        .addStringOption(option => option.setName("email")
        .setDescription("Your Email Which Will Be Used To Login.")
        .setRequired(true))
        .addStringOption(option => option.setName("password")
        .setDescription("Your Password Which Will Be Used To Login.")
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = interaction.options.getString('username');
            const email = interaction.options.getString('email');
            const password = interaction.options.getString('password');
            const userId = interaction.user.id;
            function generateAccountId() {
                const uuid = (0, uuid_1.v4)();
                const accountId = uuid.replace(/-/g, '').substring(0, 32);
                return accountId.toUpperCase();
            }
            if (!username || !email || !password) {
                return interaction.reply({ content: 'All fields are required!', ephemeral: true });
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            try {
                const existingUser = yield user_1.default.findOne({ discordId: userId });
                if (existingUser) {
                    const embed = new discord_js_2.EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle("Failed To Create An Account!")
                        .setDescription("Reason: You already created an account!");
                    yield interaction.reply({ embeds: [embed], ephemeral: true });
                    return;
                }
                const newUser = new user_1.default({
                    created: new Date(),
                    banned: false,
                    discordId: userId,
                    accountId: generateAccountId(),
                    username: username,
                    username_lower: username.toLowerCase(),
                    email: email,
                    password: hashedPassword
                });
                yield newUser.save();
                const embed = new discord_js_2.EmbedBuilder()
                    .setColor("#a600ff")
                    .setTitle("Successfully Registered")
                    .addFields({
                    name: "Username",
                    value: username,
                    inline: false,
                }, {
                    name: "Email Adress",
                    value: `||${email}||`,
                    inline: false,
                });
                yield interaction.reply({ embeds: [embed], ephemeral: true });
            }
            catch (error) {
                console.error('Error registering user:', error);
                yield interaction.reply({ content: 'There was an error registering your account. Please try again later.', ephemeral: true });
            }
        });
    }
};

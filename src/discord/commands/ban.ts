import { ChatInputCommandInteraction, Embed, SlashCommandBuilder, TextChannel, PermissionFlagsBits } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import User from '../../database/models/user';
require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban someone from ArcaneV4!")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option =>
        option.setName("username")
            .setDescription("Who do you want to ban?")
            .setRequired(true))
    .addStringOption(option =>
        option.setName("reason")
            .setDescription("Why do you want to ban that user?")
            .setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const reason = interaction.options.getString('reason');
            const user = await User.findOne({ username_lower: interaction.options.getString('username')?.toLowerCase() });
            if (!user) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed to ban user")
                    .setDescription("Reason: Couldn't find the user you were trying to ban.");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
            else if (user.banned) {
                const embed = new EmbedBuilder()
                .setColor("#ff0000")
                .setTitle("Failed to ban user")
                .setDescription("Reason: The user you were trying to ban is allready banned!")

            await interaction.reply({ embeds: [embed], ephemeral: true});
            }

            await user.updateOne({ $set: { banned: true} });
            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Someone got hit with the Ban Hammer")
                .addFields(
                    {
                        name: "Username",
                        value: user.username,
                        inline: true
                    },
                    { 
                        name: "Reason",
                        value: reason || "No reason provided",
                        inline: false
                    }
                );

            if (process.env.BAN_EMBED_ENABLED === "true") {
                const channelId = process.env.BAN_EMBED_CHANNELID;

                if (typeof channelId === 'string') {
                    const banChannel = interaction.client.channels.cache.get(channelId) as TextChannel; 
                    
                    if (banChannel && banChannel.isTextBased()) {
                        await banChannel.send({ embeds: [embed] });
                    } else {
                        console.log(`Could not find text-based channel with the ID: ${channelId}`);
                    }
                }
            }

            await interaction.reply({ content: `Successfully banned ${user.username}!`, ephemeral: true });
        } catch (error) {
            console.error("Error executing the ban command:", error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};

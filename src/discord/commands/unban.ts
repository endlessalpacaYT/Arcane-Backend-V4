import { ChatInputCommandInteraction, Embed, SlashCommandBuilder, TextChannel, PermissionFlagsBits } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import User from '../../database/models/user';
require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("unban someone from ArcaneV4!")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option =>
        option.setName("username")
            .setDescription("Who do you want to unban?")
            .setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = await User.findOne({ username_lower: interaction.options.getString('username')?.toLowerCase() });
            if (!user) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed to unban user")
                    .setDescription("Reason: Couldn't find the user you were trying to unban.");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
            else if (user.banned == false) {
                const embed = new EmbedBuilder()
                .setColor("#ff0000")
                .setTitle("Failed to unban user")
                .setDescription("Reason: The user you were trying to unban isn't banned!")

            await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await user.updateOne({ $set: { banned: false} });
            

            await interaction.reply({ content: `Successfully unbanned ${user.username}!`, ephemeral: true });
        } catch (error) {
            console.error("Error executing the unban command:", error);
            await interaction.editReply({ content: 'There was an error while executing this command!' });
        }
    }
};

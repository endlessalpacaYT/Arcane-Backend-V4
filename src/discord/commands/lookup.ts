import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { EmbedBuilder } from "discord.js";
import User from "../../database/models/user";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lookup")
    .setDescription("Lookup another user")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select the user you want to lookup.")
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const user = await User.findOne({
        discordId: interaction.options.getUser("user")?.id,
      });
      if (!user) {
        const embed = new EmbedBuilder()
          .setColor("#ff0000")
          .setTitle("Failed To lookup that user")
          .setDescription("Reason: that user doesent have an account!");

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor("#a600ff")
        .setTitle("User lookup")
        .addFields(
          {
            name: "Created",
            value: new Date(user.created).toLocaleDateString(),
            inline: true,
          },
          {
            name: "Banned",
            value: user.banned ? "🔴 Yes" : "🟢 No",
            inline: false,
          },
          {
            name: "Account ID",
            value: `\`${user.accountId}\``,
            inline: false,
          },
          {
            name: "Username",
            value: user.username,
            inline: false,
          }
        );

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error executing the lookup command:", error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};

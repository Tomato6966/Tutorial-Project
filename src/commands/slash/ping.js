import { SlashCommandBuilder } from "discord.js";
/** @type {import("../../structures/Types.js").SlashCommand} */
export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Get my latency!")
        .toJSON(),
    execute: async (client, interaction) => {
        await interaction.reply({
            content: `Pong! ${client.ws.ping}ms`,
            ephemeral: true
        }).catch(console.warn);
    }
}
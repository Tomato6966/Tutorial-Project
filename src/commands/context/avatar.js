import { ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";
/** @type {import("../../structures/Types.js").ContextCommandUser} */
export default {
    data: new ContextMenuCommandBuilder()
        .setType(ApplicationCommandType.User)
        .setName("avatar")
        .toJSON(),
    execute: async (client, interaction) => {
        await interaction.reply({
            content: `${interaction.targetMember.displayAvatarURL()}`,
            ephemeral: true
        }).catch(console.warn);
    }
}
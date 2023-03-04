import { ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";

/** @type {import("../../../structure/Types.js").ContextCommandMessage} */
export default {
    data: new ContextMenuCommandBuilder()
        .setName("authoravatar")
        .setType(ApplicationCommandType.Message)
        .toJSON(),
    execute: async (client, interaction) => {
        interaction.reply({
            content: `${interaction.targetMessage.author.displayAvatarURL()}`,
            ephemeral: true,
        })
        return;
    }
}
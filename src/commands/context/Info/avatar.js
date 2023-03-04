import { ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";

/** @type {import("../../../structure/Types.js").ContextCommandUser} */
export default {
    data: new ContextMenuCommandBuilder()
        .setName("avatar")
        .setType(ApplicationCommandType.User)
        .toJSON(),
    execute: async (client, interaction) => {
        interaction.reply({
            content: `${interaction.targetMember.displayAvatarURL()}`,
            ephemeral: true,
        })
        return;
    }
}
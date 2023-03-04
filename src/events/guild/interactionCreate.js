/**
 * @param {import("../../structures/Client.js").yourBotClient} client
 * @param {import("discord.js").Interaction} interaction
 */
export default async (client, interaction) => {
    console.log(interaction)
    /** @type {import("../../structures/Types.js").SlashCommand} */
    const cmd = client.commands.get(interaction.commandName);
    if(cmd) {

        cmd.execute(client, interaction);
    }
}
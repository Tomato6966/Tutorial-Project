/**
 * @typedef {object} SlashCommand
 * @property {import("discord.js").SlashCommandBuilder} data
 * @property {(client:import("../structures/Client.js").yourBotClient, interaction: import("discord.js").CommandInteraction) => {}} execute
 */

/**
 * @typedef {object} ContextCommandUser
 * @property {import("discord.js").ContextMenuCommandBuilder} data
 * @property {(client:import("../structures/Client.js").yourBotClient, interaction: import("discord.js").UserContextMenuCommandInteraction) => {}} execute
 */
export default {}
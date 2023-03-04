import { ActivityType } from "discord.js";
/**
 * @param {import("../../structures/Client.js").yourBotClient} client
 */
export default (client) => {
    console.log(`${client.user.tag} is now logged in.`)
    console.table({
        guilds: client.guilds.cache.size,
        members: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
        ping: client.ws.ping
    });
    client.user.setActivity({
        name: `Try /ping`,
        type: ActivityType.Playing
    })
    client.publishCommands(); // now publish the commands!
}
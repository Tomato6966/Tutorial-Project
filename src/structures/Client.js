import { Client, GatewayIntentBits, Options, Collection, ActivityType } from "discord.js";
import { promises } from "node:fs";
import { pathToFileURL } from "node:url";
import { basename, dirname, resolve } from "node:path";


export class yourBotClient extends Client {
    constructor() {
        super({
            intents: [ GatewayIntentBits.Guilds ],
            makeCache: Options.cacheWithLimits({
                MessageManager: { maxSize: 0 },
                PresenceManager: { maxSize: 0 }
            }),
            presence: {
                activities: [
                    { name: "Booting up", type: ActivityType.Playing }
                ]
            }
        });
        /** @type {Collection<string, import("./Types").SlashCommand>} */
        this.commands = new Collection();
        this.shouldPublish = true;
        this.devCommandGuild = "1081519176369324092";
        this.initBot();
    }
    /** @private */
    async initBot() {
        await this.loadEvents();
        await this.loadCommands();

        this.emit("finishedLoadingBot", this);
        this.login(process.env.DISCORD_TOKEN)
    }
    async publishCommands() {
        if(this.shouldPublish === false) return;
        if(this.devCommandGuild?.length) {
            const guild = this.guilds.cache.get(this.devCommandGuild);
            if(!guild) return;
            await guild.commands.set(this.commands.map(c => c.data));
            console.log("published the commands to the dev guild");
        } else {
            await this.commands.set(this.commands.map(c => c.data));
            console.log("published the commands to the ALL guilds");
        }
        return;
    }
    /** @private */
    async loadCommands() {
        const paths = await walkThroughDir(`${process.cwd()}/src/commands`);
        return await Promise.all(paths.map(async path => {
            try {
                const resolvePath = resolve(path);
                const command = await import(transformPath(path)).then(r => r.default);
                this.commands.set(command.data.name, { ...command, category: getDirOfpath(resolvePath)?.toLowerCase() })
            } catch (e) {
                console.error(e);
            }
        }))
    }
    /** @private */
    async loadEvents() {
        const paths = await walkThroughDir(`${process.cwd()}/src/events`);
        return await Promise.all(paths.map(async path => {
            try {
                const resolvePath = resolve(path);
                const event = await import(transformPath(path)).then(r => r.default);
                const eventName = fileName(resolvePath);
                this.on(eventName, event.bind(null, this));
            } catch (e) {
                console.error(e);
            }
        }))
    }
}

// /home/bot/client.js -> bot
function getDirOfpath(path) {
    const res = dirname(transformPath(path)) || dirname(fileNameManual(path));
    if(!res) return path.split("/").reverse()[0];
    if(res.includes("/")) return res.split("/").reverse()[0];
    return res;
}
// /home/bot/client.js c://home/user/Desktop/bot/client.js 
function transformPath(path) {
    return pathToFileURL(path)?.href || path;
}
// /home/bot/client.js -> client
function fileName(path) {
    return basename(path)?.split(".")[0] || fileNameManual(path);
}
// /home/bot/client.js -> client
function fileNameManual(path) {
    return path.includes("/") ? path.split("/").reverse()[0].split(".")[0] : path.includes("/") ? path.split("\\").reverse()[0].split(".")[0] : path;
}
async function walkThroughDir(path, recursive = true) {
    let files = [];
    const items = await promises.readdir(path, { withFileTypes: true });
    if(!items?.length) throw new Error(`No items in ${path}`);
    for(let i = 0, m = items.length; i < m; ++i) {
        if(items[i].isDirectory()) {
            if(recursive === true) files = [
                ...files,
                ...(await walkThroughDir(`${path}/${items[i].name}`, recursive))
            ]
        } else if(items[i].isFile()) {
            files.push(`${path}/${items[i].name}`);
        }
    }
    return files;
}
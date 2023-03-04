import { Client, GatewayIntentBits, Collection, Options } from "discord.js";
import { promises } from "node:fs";
import { pathToFileURL } from "node:url";
import { basename, dirname, resolve } from "node:path";

export class yourBotClient extends Client {
    constructor() {
        super({
            // Here come your Bot options
            intents: [ GatewayIntentBits.Guilds ],
            makeCache: Options.cacheWithLimits({
                MessageManager: { maxSize: 0 },
                PresenceManager: { maxSize: 0 },  
            })
        })

        this.commands = new Collection();
        this.shouldPublish = true;
        this.devCommandGuild = "1081519176369324092";
        this.initBot();
    }

    async publishCommands() {
        if(this.shouldPublish === true && this.devCommandGuild) {
            const devGuild = this.guilds.cache.get(this.devCommandGuild);
            if(devGuild) devGuild.commands.set(this.commands.map(c => c.data));
        } else if(this.shouldPublish === true) {
            this.commands.set(this.commands.map(c => c.data))
        }
    }
    /** @private */
    async initBot() {
        await this.loadEvents();
        await this.loadCommands();

        this.emit("yourBotCustomReady", this);
        this.login(process.env.DISCORD_TOKEN);
    }
    /** @private */
    async loadCommands() {
        const paths = await walkThroughDir(`${process.cwd()}/src/commands`);
        await Promise.all(paths.map(async path => {
            try {
                const resolvedPath = resolve(path);
                const command = await import(transformPath(resolvedPath)).then(r => r.default);
                this.commands.set(command.data.name, { ...command, category: getDirOfpath(resolvedPath)?.toLowerCase() });
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
                const resolvedPath = resolve(path);
                const event = await import(transformPath(resolvedPath)).then(r => r.default);
                const eventName = fileName(resolvedPath);
                this.on(eventName, event.bind(null, this));
            } catch (e) {
                console.error(e);
            }
        }))
    }
}
function getDirOfpath(path) {
    const res = dirname(transformPath(path)) || dirname(fileNameManual(path));
    if(!res) return path.split("/").reverse()[0];
    if(res.includes("/")) return res.split("/").reverse()[0];
    return res;
}
function transformPath(path) {
    return pathToFileURL(path)?.href || path;
}
function fileName(path) {
    return basename(path)?.split(".")[0] || fileNameManual(path);
}
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
            ];
        } else if(items[i].isFile()) {
            files.push(`${path}/${items[i].name}`);
        }
    }
    return files;
}
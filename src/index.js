import { config } from "dotenv";
import { yourBotClient } from "./structures/Client.js";
config();

// Today's Project:
// Discord Bot!

const client = new yourBotClient();
client.on("yourBotCustomReady", () => console.log("Bot finished loading all files, now logging in to Discord"))
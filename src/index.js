import { config } from "dotenv";
import { yourBotClient } from "./structure/Client.js";
config();

const client = new yourBotClient();

client.on("finishedLoadingBot", () => {
    console.log("BOT IS FINISHED LOADING and now LOGS IN TO DISCORD");
})
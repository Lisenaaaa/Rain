require('dotenv').config()
import { BotClient } from "./extensions/BotClient";

const client = new BotClient();
client.start();
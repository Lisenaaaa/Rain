require('dotenv').config()
const { MongoClient } = require("mongodb");
const uri = process.env["mongodb"]

//starting the bot

import { BotClient } from "./extensions/BotClient";

const client = new BotClient();
client.start();

//mongodb shit


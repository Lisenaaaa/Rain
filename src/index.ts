require('dotenv').config()
const { MongoClient } = require("mongodb");
const uri = process.env["mongodb"]

//starting the bot

import { BotClient } from "./extensions/BotClient";

const client = new BotClient();
client.start();

//mongodb shit

const mongoclient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await mongoclient.connect();

    console.log(`Connected to MongoDB!`)

  } finally {
    // Ensures that the client will close when you finish/error
    await mongoclient.close();
  }
}
run().catch(console.dir);
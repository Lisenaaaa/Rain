import 'module-alias/register'

require('dotenv').config()
const { MongoClient } = require('mongodb')
const uri = process.env['mongodb']

//starting the bot

import { BotClient } from '@extensions/BotClient'

const client = new BotClient()

try {client.start()}
catch(error){console.error(error)}


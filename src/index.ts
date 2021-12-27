import config from './config/config'
import { RainClient } from './structures/RainClient'
import Database from './functions/database'
import '@sapphire/plugin-editable-commands/register'

if (process.platform === 'win32') {
	throw new Error('Please use a good OS.')
}

new Database().initDB()

const client = new RainClient()
void client.login(new config().tokens.main)
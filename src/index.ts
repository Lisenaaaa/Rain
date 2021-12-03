import { container } from '@sapphire/pieces'
import config from './config/config'
import Settings from './config/settings'
import { RainClient } from './structures/RainClient'
import Database from './functions/database'
import Utilities from './functions/utilities'
import Users from './functions/objectfunctions/users'
import Guilds from './functions/objectfunctions/guilds'
import Channels from './functions/objectfunctions/channels'
import Logger from './functions/logger'

if (process.platform === 'win32') {
	throw new Error('Please use a good OS.')
}

new Database().initDB()

const client = new RainClient()
void client.login(config.tokens.main)

container.database = new Database()
container.config = new Settings()
container.utils = new Utilities()
container.logging = new Logger()

container.users = new Users()
container.guilds = new Guilds()
container.channels = new Channels()

client.on('rateLimit', (event: unknown) => {
	console.log(event)
})
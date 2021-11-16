import '@sapphire/plugin-logger/register'

import { container } from '@sapphire/pieces'
import config from './config/config'
import Settings from './config/settings'
import { RainClient } from './extensions/RainClient'
import Database from './functions/database'
import Utilities from './functions/utilities'
import Users from './functions/objectfunctions/users'
import Guilds from './functions/objectfunctions/guilds'
import Channels from './functions/objectfunctions/channels'

if (process.platform === 'win32') {
	throw new Error('Please use a good OS.')
}

new Database().initDB()

const client = new RainClient()
void client.login(config.tokens.main)

container.database = new Database()
container.config = new Settings()
container.utils = new Utilities()

container.users = new Users()
container.guilds = new Guilds()
container.channels = new Channels()
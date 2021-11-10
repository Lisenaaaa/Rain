import '@sapphire/plugin-logger/register'

import { container } from '@sapphire/pieces'
import config from './config/config'
import Settings from './config/settings'
import { RainClient } from './extensions/RainClient'
import Database from './functions/database'

(new Database()).initDB()

const client = new RainClient()

void client.login(config.tokens.main)


container.config = new Settings()
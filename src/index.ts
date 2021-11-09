import { SapphireClient } from '@sapphire/framework'
import config from './config/config'

const client = new SapphireClient({
	intents: ['GUILDS', 'GUILD_MESSAGES'],
	defaultPrefix: '-',
	allowedMentions: { parse: [] },
})

void client.login(config.tokens.main)

export default client
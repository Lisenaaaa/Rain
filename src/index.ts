import '@sapphire/plugin-logger/register';
import config from './config/config'
import { RainClient } from './extensions/RainClient';

const client = new RainClient({
	intents: ['GUILDS', 'GUILD_MESSAGES'],
	defaultPrefix: '-',
	allowedMentions: { parse: [] },
})

void client.login(config.tokens.main)

export default client

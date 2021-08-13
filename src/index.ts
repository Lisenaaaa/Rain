import 'module-alias/register'
import config from '@src/config/config'
import BotClient from '@extensions/BotClient'

BotClient.preStart()

const client = new BotClient()

const token = config.misc.tokenToUse as keyof typeof config.tokens

client.start(config.tokens[token]).catch(console.error)

export default client

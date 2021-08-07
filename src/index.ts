import 'module-alias/register'
import config from '@src/config/config'
import BotClient from "@extensions/BotClient"

const client = new BotClient()

if (Object.keys(config.tokens).includes(config.misc.tokenToUse)) {

const token = config.misc.tokenToUse as keyof typeof config.tokens

client.preStart()
client
    .start(config.tokens[token])
    .catch(console.error)
}

export default client
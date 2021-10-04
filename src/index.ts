import RainClient from 'src/extensions/RainClient'
import config from '@src/config/config'
import 'module-alias/register'

RainClient.preStart()

const client = new RainClient()

const token = config.misc.tokenToUse as keyof typeof config.tokens

client.start(config.tokens[token]).catch(console.error)

export default client

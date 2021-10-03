import BotClient from '@extensions/RainClient'
import { Listener } from 'discord-akairo'

export class RainListener extends Listener {
	declare client: BotClient
}

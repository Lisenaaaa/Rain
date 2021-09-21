import { Listener } from 'discord-akairo'
import BotClient from '@extensions/RainClient'

export class RainListener extends Listener {
	declare client: BotClient
}

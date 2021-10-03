import BotClient from '@extensions/RainClient'
import { Inhibitor } from 'discord-akairo'

export class RainInhibitor extends Inhibitor {
	declare client: BotClient
}

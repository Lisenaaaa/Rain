import BotClient from '@extensions/RainClient'
import { Task } from 'discord-akairo'

export class RainTask extends Task {
	declare client: BotClient
}

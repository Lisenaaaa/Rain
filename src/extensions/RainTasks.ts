import BotClient from '@extensions/RainClient'
import { Task } from 'discord-akairo'

export class RainTasks extends Task {
	declare client: BotClient
}

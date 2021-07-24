import { Task } from "discord-akairo";
import BotClient from "@extensions/BotClient"

export class BotTasks extends Task {
	declare client: BotClient
}
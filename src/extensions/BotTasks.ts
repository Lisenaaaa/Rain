import { Task } from "discord-akairo";
import { BotClient } from "./BotClient";

export class BotTasks extends Task {
	declare client: BotClient
}
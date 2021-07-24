import { Listener } from "discord-akairo";
import BotClient from "@extensions/BotClient"

export class BotListener extends Listener {
	declare client: BotClient
}
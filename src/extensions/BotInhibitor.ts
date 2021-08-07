import { Inhibitor } from "discord-akairo";
import BotClient from "@extensions/BotClient"

export class BotInhibitor extends Inhibitor {
	declare client: BotClient
}
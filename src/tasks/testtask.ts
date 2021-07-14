import { BotTasks } from '@extensions/BotTasks'

export default class extends BotTasks {
	constructor() {
		super("hello", {
			delay: 20000,
			runOnStart: false
		});
	}
	async exec() {
		//console.log("hello from", this.client.user.username)
	}
}
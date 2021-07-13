import { BotTasks } from '@extensions/BotTasks'

export default class extends BotTasks {
	constructor() {
		super("hello", {
			delay: 200,
			runOnStart:true
		});
	}
	async exec() {
		console.log("hello from", this.client.user.username);
	}
}
import { RainTasks } from '@extensions/RainTasks'

export default class extends RainTasks {
	constructor() {
		super('hello', {
			delay: 20000,
			runOnStart: false,
		})
	}
	async exec() {
		//console.log("hello from", this.client.user.username)
	}
}

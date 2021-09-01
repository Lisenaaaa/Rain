import { BotListener } from '@extensions/BotListener'

export default class miscErrorListener extends BotListener {
	constructor() {
		super('miscErrorListener', {
			emitter: 'process',
			event: 'unhandledRejection',
		})
	}
	async exec(error: any) {
		if (error == "TypeError: Cannot read property 'send' of undefined" && this.client.user == null) {
			console.error(`Couldn't log in.`)
			//process.exit()
		}

		if (error == "TypeError: Cannot read property 'send' of undefined" && this.client.user != null) {
			console.error(error)
		}

		this.client.utils.error(error)
	}
}

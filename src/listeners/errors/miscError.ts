import { RainListener } from '@extensions/RainListener'
import chalk from 'chalk'

export default class MiscErrorListener extends RainListener {
	constructor() {
		super('miscError', {
			emitter: 'process',
			event: 'unhandledRejection',
		})
	}
	async exec(error: Error) {
		if (error.message == "TypeError: Cannot read property 'send' of undefined" && this.client.user == null) {
			console.error(`Couldn't log in.`)
			process.exit()
		}

		if (error.message == "TypeError: Cannot read property 'send' of undefined" && this.client.user != null) {
			console.error(error)
		}

		await this.client.utils.error(error)
		this.client.debug ? console.error(chalk.red(error.stack)) : {}
	}
}

import { RainListener } from '@extensions/RainListener'
import chalk from 'chalk'

export default class miscErrorListener extends RainListener {
	constructor() {
		super('miscErrorListener', {
			emitter: 'process',
			event: 'unhandledRejection',
		})
	}
	async exec(error: Error) {
		if (error.message == "TypeError: Cannot read property 'send' of undefined" && this.client.user == null) {
			console.error(`Couldn't log in.`)
			//process.exit()
		}

		if (error.message == "TypeError: Cannot read property 'send' of undefined" && this.client.user != null) {
			console.error(error)
		}

		await this.client.utils.error(error)
		console.error(chalk.red(error.stack))
	}
}

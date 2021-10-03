import chalk from 'chalk'
import { RainListener } from '@extensions/RainListener'

export default class ReadyListener extends RainListener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
		})
	}

	async exec() {
		console.log(chalk`{magenta Logged in as} {magentaBright.bold ${this.client.user?.tag}}`)
		console.log(`\n`)
		console.log(chalk.magentaBright(`---Bot Output---\n`))

		this.client.user?.setActivity('Lisena create me', { type: 'WATCHING' })
	}
}

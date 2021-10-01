import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { RainCommand } from '@extensions/RainCommand'
import { RainInhibitor } from '@extensions/RainInhibitor'

export default class extends RainInhibitor {
	constructor() {
		super('commandHandler', {
			reason: 'commandHandler',
		})
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async exec(message: RainMessage, command: RainCommand) {
		return false
	}
}

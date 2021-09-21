import { RainInhibitor } from '@extensions/RainInhibitor'
import { AkairoMessage } from 'discord-akairo'

export default class BlacklistInhibitor extends RainInhibitor {
	constructor() {
		super('blacklist', {
			reason: 'blacklist',
		})
	}

	exec(message: AkairoMessage) {
		if (message.util.parsed?.command?.id && message.util.parsed?.command?.id != 'test') console.log('go fix commandManager.ts smh its not functional rn')
		//you dont even deserve the honor of being in my database
		const blacklist = ['600875620808785941']
		return blacklist.includes(message.author.id)
	}
}

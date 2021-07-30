import { BotInhibitor } from '@extensions/BotInhibitor';

export default class BlacklistInhibitor extends BotInhibitor {
	constructor() {
		super('blacklist', {
			reason: 'blacklist'
		});
	}

	exec(message) {
		//you dont even deserve the honor of being in my database
		const blacklist = ['600875620808785941']
		return blacklist.includes(message.author.id)
	}
}
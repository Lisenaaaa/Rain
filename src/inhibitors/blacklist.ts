import { RainMember } from '@extensions/discord.js/GuildMember'
import { RainMessage } from '@extensions/discord.js/Message'
import { RainInhibitor } from '@extensions/RainInhibitor'
import { AkairoMessage } from 'discord-akairo'

export default class BlacklistInhibitor extends RainInhibitor {
	constructor() {
		super('blacklist', {
			reason: 'blacklist',
		})
	}

	exec(message: RainMessage) {
		/* if (message.util.parsed?.command?.id && message.util.parsed?.command?.id != 'test') */console.log('go make a perms handler idiot')
		//you dont even deserve the honor of being in my database
		const blacklist = ['600875620808785941']
		return blacklist.includes(message.author.id)
	}
}

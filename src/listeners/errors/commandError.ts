import { RainCommand } from '@extensions/RainCommand'
import { RainListener } from '@extensions/RainListener'
import { Message } from 'discord.js'

export default class commandErrorListener extends RainListener {
	constructor() {
		super('commandErrorListener', {
			emitter: 'commandHandler',
			event: 'error',
		})
	}
	async exec(error: any, message: Message, command: RainCommand) {
		if (this.client.ownerID.includes(message.author.id)) {
			message.reply(`An error occured!\n\`\`\`js\n${error.stack}\`\`\``)
		} else {
			message.reply({ embeds: [this.client.utils.error(error, ' command', message)] })
		}
	}
}

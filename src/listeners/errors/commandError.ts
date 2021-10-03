import { RainListener } from '@extensions/RainListener'
import chalk from 'chalk'
import { Message } from 'discord.js'

export default class CommandErrorListener extends RainListener {
	constructor() {
		super('commandError', {
			emitter: 'commandHandler',
			event: 'error',
		})
	}
	async exec(error: Error, message: Message) {
		if (this.client.ownerID.includes(message.author.id)) {
			message.reply(`An error occured!\n\`\`\`js\n${error.stack}\`\`\``)
		} else {
			await message.reply({ embeds: [this.client.utils.error(error, ' command', message)] })
			console.error(chalk.red(error.stack))
		}
	}
}

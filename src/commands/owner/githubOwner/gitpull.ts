import { exec } from 'child_process'
import { Message, MessageEmbed } from 'discord.js'
import { inspect, promisify } from 'util'
import { BotCommand } from '@extensions/BotCommand'

const sh = promisify(exec)

export default class gitpull extends BotCommand {
	constructor() {
		super('gitpull', {
			aliases: ['gitpull', 'pull'],
			ownerOnly: true,
			channel: 'guild',
		})
	}

	async exec(message: Message) {
		const githubembed = new MessageEmbed()

		const pull = sh('git pull')
		githubembed.setDescription(`\`\`\`js\n${inspect(pull)}\`\`\``)

		message.reply({ embeds: [githubembed] })
	}
}

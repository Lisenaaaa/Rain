import { RainCommand } from '@extensions/RainCommand'
import { exec } from 'child_process'
import { Message, MessageEmbed } from 'discord.js'
import { inspect, promisify } from 'util'

const sh = promisify(exec)

export default class GitPull extends RainCommand {
	constructor() {
		super('gitPull', {
			aliases: ['gitpull', 'pull'],
			ownerOnly: true,
			channel: 'guild',
			defaultPerms: 'owner'
		})
	}

	async exec(message: Message) {
		const githubembed = new MessageEmbed()

		const pull = sh('git pull')
		githubembed.setDescription(`\`\`\`js\n${inspect(pull)}\`\`\``)

		message.reply({ embeds: [githubembed] })
	}
}

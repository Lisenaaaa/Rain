import { exec } from 'child_process'
import { Message, MessageEmbed } from 'discord.js'
import { promisify } from 'util'
import { inspect } from 'util'
import { RainCommand } from '@extensions/RainCommand'
import utils from '@functions/utils'

const sh = promisify(exec)

export default class console extends RainCommand {
	constructor() {
		super('console', {
			aliases: ['console', 'sh'],
			args: [
				{
					id: 'command',
					type: 'string',
					match: 'restContent',
				},
			],
			channel: 'guild',
			ownerOnly: true,
		})
	}

	async exec(message: Message, args: {command:string}) {
		const output = await sh(args.command)

		const outputembed = new MessageEmbed().setTitle(`Console Command Ran`).addField(`:inbox_tray: Command`, `\`\`\`${args.command}\`\`\``)

		if (inspect(output).length > 1000) {
			await outputembed.addField(`:outbox_tray: **Output**`, await utils.haste(inspect(output)))
		} else {
			outputembed.addField(`:outbox_tray: **Output**`, `\`\`\`js\n${inspect(output)}\`\`\``)
		}

		message.reply({ embeds: [outputembed] })
	}
}

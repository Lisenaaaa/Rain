import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { RainCommand } from '@extensions/RainCommand'
import { MessageEmbed } from 'discord.js'

export default class help extends RainCommand {
	constructor() {
		super('help', {
			aliases: ['help'],
			args: [{ id: 'command', type: 'string' }],
			description: 'You already know what this does, otherwise you wouldnt be using it, right?',
			usage: '-help\n-help <command ID>',
			discordPerms: ['SEND_MESSAGES'],
			defaultPerms: 'none'
		})
	}
	async execSlash(message: RainMessage, args: { command: string }) {
		if (!args.command) {
			let commandIDs: string[] = []
			this.client.commandHandler.modules.forEach((c) => {
				if (!c.ownerOnly && !c.id.includes('help') && !c.id.includes('test')) commandIDs.push(c.id)
			})
			let commandString = ''
			commandIDs = commandIDs.filter((ID) => !ID.includes('help'))

			commandString = `\`${commandIDs.shift()}\``

			commandIDs.forEach((c) => (commandString = commandString + `, \`${c}\``))

			await message.reply(commandString)
		}
		if (args.command) {
			const command = this.client.commandHandler.modules.get(args.command) as RainCommand

			const helpEmbed = new MessageEmbed().setTitle(command.id).setDescription(command.description).addField('Usage', command.usage)

			message.send({ embeds: [helpEmbed] })
		}
	}
}

import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { RainCommand } from '@extensions/RainCommand'
import Handler from '@functions/handler'
import { MessageEmbed } from 'discord.js'

export default class help extends RainCommand {
	constructor() {
		super('help', {
			aliases: ['help'],
			args: [{ id: 'command', type: 'string' }],
			description: 'You already know what this does, otherwise you wouldnt be using it, right?',
			discordPerms: ['SEND_MESSAGES'],
			defaultPerms: 'none',
		})
	}
	async execSlash(message: RainMessage, args: { command: string }) {
		if (!args.command) {
			const commandIDs: string[] = Handler.getAllCommands().filter((c) => c != 'help')
			let commandString = ''

			commandString = `\`${commandIDs}\``

			commandIDs.forEach((c) => (commandString = commandString + `, \`${c}\``))

			await message.reply(commandString)
		}
		if (args.command) {
			const command = this.client.commandHandler.modules.get(args.command) as RainCommand

			const helpEmbed = new MessageEmbed().setTitle(command.id).setDescription(command.description)

			message.reply({ embeds: [helpEmbed] })
		}
	}
}

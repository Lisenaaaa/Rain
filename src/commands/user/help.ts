import { Message, MessageEmbed } from 'discord.js'
import { BotCommand } from '@extensions/BotCommand'
import commandManager from '@functions/commandManager'

export default class help extends BotCommand {
	constructor() {
		super('help', {
			aliases: ['help'],
			args: [{ id: 'command', type: 'string' }],
			description: 'You already know what this does, otherwise you wouldnt be using it, right?',
			usage: '-help\n-help <command ID>',
			discordPerms: ['SEND_MESSAGES'],
		})
	}
	async exec(message: Message, args: {command:string}) {
		if (!args.command) {
			let commandIDs = await commandManager.getAllCommandIDs()
			commandIDs = commandIDs.filter((ID) => ID != 'help')

			message.channel.send(JSON.stringify(commandIDs))
		}
		if (args.command) {
			const command = this.client.commandHandler.modules.get(args.command) as BotCommand

			const helpEmbed = new MessageEmbed().setTitle(command.id).setDescription(command.description).addField('Usage', command.usage)

			message.channel.send({ embeds: [helpEmbed] })
		}
	}
}

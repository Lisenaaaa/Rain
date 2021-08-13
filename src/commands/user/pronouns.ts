import { Message, MessageEmbed, User } from 'discord.js'
import { BotCommand } from '@extensions/BotCommand'
import utils from '@functions/utils'
import commandManager from '@functions/commandManager'

export default class pronouns extends BotCommand {
	constructor() {
		super('pronouns', {
			aliases: ['pronouns'],
			args: [{ id: 'person', type: 'user', match: 'rest', default: (message: Message) => message.author }],

			description: 'Shows the pronouns of a user, if they have them set on https://pronoundb.org',
			usage: '-pronouns <user>',
			discordPerms: ['SEND_MESSAGES'],

			slash: true,
			slashOptions: [
				{
					name: 'user',
					description: 'The user you want to know the pronouns of',
					type: 'USER',
				},
			],
		})
	}
	async exec(message: Message, args: any) {
		if (!commandManager.checkIfCommandCanBeUsed(message, this.id)) {
			return
		}

		const pronouns = await utils.getPronouns(args.person, 'details')
		const pronounsEmbed = new MessageEmbed()

		if (args.person.id == message.author.id) {
			pronounsEmbed.setTitle('Your pronouns')
		} else {
			pronounsEmbed.setTitle(`${args.person.username}'s pronouns`)
		}

		if (pronouns === undefined) {
			pronounsEmbed.setDescription(`No pronouns were found on https://pronoundb.org/ for ${args.user.tag}`)
		} else {
			pronounsEmbed.setDescription(pronouns!)
		}
		pronounsEmbed.setFooter('Data from https://pronoundb.org')

		message.reply({ embeds: [pronounsEmbed] })
	}

	// async execSlash(message:Message, args:any) {

	// }
}

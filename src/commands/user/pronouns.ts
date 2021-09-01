import { Message, MessageEmbed } from 'discord.js'
import { BotCommand } from '@extensions/BotCommand'
import commandManager from '@functions/commandManager'

export default class pronouns extends BotCommand {
	constructor() {
		super('pronouns', {
			aliases: ['pronouns'],
			args: [{ id: 'person', type: 'string', match: 'rest', default: (message: Message) => message.author }],

			description: 'Shows the pronouns of a user, if they have them set on https://pronoundb.org',
			usage: '-pronouns <user>',
			discordPerms: ['SEND_MESSAGES'],

			slash: true,
			slashOptions: [
				{
					name: 'person',
					description: 'The user you want to know the pronouns of',
					type: 'USER',
				},
			],
		})
	}
	async exec(message: Message, args: {person:string}) {
		if (!commandManager.checkIfCommandCanBeUsed(message, this.id)) return

		const person = await this.client.utils.fetchUser(args.person)

		const pronouns = await person.getPronouns('details')
		const pronounsEmbed = new MessageEmbed()

		if (person.id == message.author.id) {
			pronounsEmbed.setTitle('Your pronouns')
		} else {
			pronounsEmbed.setTitle(`${person.username}'s pronouns`)
		}

		if (pronouns === undefined) {
			pronounsEmbed.setDescription(`No pronouns were found on https://pronoundb.org/ for ${person.tag}`)
		} else {
			pronounsEmbed.setDescription(pronouns)
		}
		pronounsEmbed.setFooter('Data from https://pronoundb.org')

		message.reply({ embeds: [pronounsEmbed] })
	}
}

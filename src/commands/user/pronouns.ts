import { Message, MessageEmbed } from 'discord.js'
import { RainCommand } from '@extensions/RainCommand'
import { RainUser } from '@extensions/discord.js/User'
import { dRainMessage } from '@extensions/discord.js/Message'
import { RainMessage } from '@extensions/akairo/AkairoMessage'

export default class pronouns extends RainCommand {
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
			ephemeralWhenNoPerms: true
		})
	}

	async exec (message: dRainMessage) {await message.reply('Use this as a slashcommand.')
}
	async execSlash(message: RainMessage, args: {person:string}) {
		const person = await this.client.utils.fetchUser(args.person) ?? message.author as RainUser

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

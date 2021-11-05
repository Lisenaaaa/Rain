import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { DRainMessage } from '@extensions/discord.js/Message'
import { RainUser } from '@extensions/discord.js/User'
import { RainCommand } from '@extensions/RainCommand'
import { Message, MessageEmbed } from 'discord.js'

export default class Pronouns extends RainCommand {
	constructor() {
		super('pronouns', {
			aliases: ['pronouns'],
			args: [{ id: 'person', type: 'string', match: 'rest', default: (message: Message) => message.author }],
			description: 'Shows the pronouns of a user, if they have them set on https://pronoundb.org',
			discordPerms: ['SEND_MESSAGES'],
			slash: true,
			slashOptions: [
				{
					name: 'person',
					description: 'The user you want to know the pronouns of',
					type: 'USER',
				},
			],
			ephemeralWhenNoPerms: true,
			defaultPerms: 'none',
			rainPerms: []
		})
	}

	async exec(message: DRainMessage) {
		await message.reply('Use this as a slashcommand.')
	}
	async execSlash(message: RainMessage, args: { person: string }) {
		await message.interaction.deferReply()
		const person = (await this.client.utils.fetchUser(args.person)) ?? (message.author as RainUser)

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

		await message.reply({ embeds: [pronounsEmbed] })
	}
}

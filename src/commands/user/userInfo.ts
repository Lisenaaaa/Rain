import { Message, MessageEmbed } from 'discord.js'
import { BotCommand } from '@extensions/BotCommand'

export default class userInfo extends BotCommand {
	constructor() {
		super('userInfo', {
			aliases: ['userInfo', 'string', 'ui', 'u'],
			args: [{ id: 'person', type: 'string', match: 'rest', default: (message: Message) => message.author.id }],
			description: 'Shows information about a user.',
			usage: '`-user`, `-user <user>`',
			discordPerms: ['SEND_MESSAGES'],
		})
	}
	async exec(message: Message, args: {person:string}) {
		//const member = message.guild?.members.fetch(args.person)
		const person = args.person
		const user = await this.client.utils.fetchUser(person)
		if (!user || !user.getBadges()) {
			return await message.reply('User not found. Try using an ID instead.')
		}
		const member = await message.guild?.members.cache.get(user.id)

		let description = ''

		user.getBadges().forEach((badge) => {
			description += badge + ' '
		})

		const userEmbed = new MessageEmbed()
			.setTitle(user.tag)
			.setDescription(description)
			.addField(
				'About',
				`
            Mention: ${user}
            ID: \`${user.id}\`
            Created at: <t:${user.timestamp}:f>
            `
			)

		await message.reply({ embeds: [userEmbed] })
	}
}

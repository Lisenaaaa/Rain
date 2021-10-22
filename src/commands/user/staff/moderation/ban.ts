import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { RainGuild } from '@extensions/discord.js/Guild'
import { RainMember } from '@extensions/discord.js/GuildMember'
import { DRainMessage } from '@extensions/discord.js/Message'
import { RainUser } from '@extensions/discord.js/User'
import { RainCommand } from '@extensions/RainCommand'
import Utils from '@functions/utils'
import { Snowflake } from 'discord.js'

export default class Ban extends RainCommand {
	constructor() {
		super('ban', {
			aliases: ['ban'],
			description: 'Ban a user.',
			discordPerms: ['MANAGE_MESSAGES'],
			defaultPerms: 'moderator',
			slash: true,
			slashOptions: [
				{
					name: 'user',
					description: 'The user to ban',
					type: 'USER',
					required: true,
				},
				{
					name: 'reason',
					description: 'The reason the user is getting banned.',
					type: 'STRING',
					required: false,
				},
				{
					name: 'time',
					description: 'How long you want to ban them for. Use formatting such as 5d or 30m',
					type: 'STRING',
					required: false,
				},
				{
					name: 'days',
					description: 'How many days back you want to delete their messages',
					type: 'NUMBER',
					required: false,
					choices: [
						{ name: '0', value: 0 },
						{ name: '1', value: 1 },
						{ name: '2', value: 2 },
						{ name: '3', value: 3 },
						{ name: '4', value: 4 },
						{ name: '5', value: 5 },
						{ name: '6', value: 6 },
						{ name: '7', value: 7 },
					],
				},
			],

			slashGuilds: Utils.slashGuilds,
		})
	}
	async exec(message: DRainMessage) {
		await message.reply('use slashcommands')
	}

	async execSlash(message: RainMessage, args: { user: RainUser; reason?: string; time: string; days?: number }) {
		const member = (await message.guild?.members.fetch(args.user)) as RainMember
		let time = null

		if (args.time) {
			time = this.client.time(args.time) + Utils.now
			if (isNaN(time)) return await message.reply({ content: "That time isn't valid!", ephemeral: true })
		}

		let sent
		try {
			sent = await args.user.send(
				time
					? `You have been banned in **${message.guild?.name}** until <t:${time}> ${args.reason ? `for ${args.reason}` : 'without a reason.'}`
					: `You have been permanently banned in **${message.guild?.name}** ${args.reason ? `for ${args.reason}` : 'without a reason.'}`
			)
		} catch (err) {
			sent = undefined
		}

		const banned = time
			? await (message.guild as RainGuild).ban(args.user, { reason: `${message.author.tag} | ${args.reason ? args.reason : 'No Reason Provided'}`, days: args.days ? args.days : 0 }, time)
			: await (message.guild as RainGuild).ban(args.user, { reason: `${message.author.tag} | ${args.reason ? args.reason : 'No Reason Provided'}`, days: args.days ? args.days : 0 })
		if (banned === false) return await message.reply({ content: 'I failed to ban that user.', ephemeral: true })
		const addedModlog = await args.user.addModlogEntry(message.guildId as Snowflake, 'BAN', message.author.id, { reason: args.reason, duration: time ? `${time}` : undefined })

		if (addedModlog === false) {
			await message.guild?.bans.remove(member)
			return await message.reply({ content: 'There was an error while adding the modlog entry for that member.', ephemeral: true })
		}
		if (sent) {
			await message.reply({ content: `**${args.user.tag}** has been ${time ? `temporarily banned until <t:${time}>` : `permanently banned.`}` })
		} else {
			return await message.reply({ content: `I couldn't DM **${args.user.tag}**, but I banned them ${time ? `until <t:${time}>.` : `permanently.`}` })
		}
	}
}

import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { RainGuild } from '@extensions/discord.js/Guild'
import { RainMember } from '@extensions/discord.js/GuildMember'
import { DRainMessage } from '@extensions/discord.js/Message'
import { RainUser } from '@extensions/discord.js/User'
import { RainCommand } from '@extensions/RainCommand'
import Utils from '@functions/utils'
import { Snowflake } from 'discord.js'

export default class Mute extends RainCommand {
	constructor() {
		super('mute', {
			aliases: ['mute'],
			description: 'Mute a user.',
			discordPerms: ['MANAGE_MESSAGES'],
			defaultPerms: 'helper',
			slash: true,
			slashOptions: [
				{
					name: 'user',
					description: 'The user to mute',
					type: 'USER',
					required: true,
				},
				{
					name: 'reason',
					description: 'The reason the user is getting muted.',
					type: 'STRING',
					required: false,
				},
				{
					name: 'time',
					description: 'How long you want to mute them for. Use formatting such as 5d or 30m',
					type: 'STRING',
					required: false,
				},
			],

			slashGuilds: Utils.slashGuilds,
			rainPerms: ['MANAGE_ROLES'],
		})
	}
	async exec(message: DRainMessage) {
		await message.reply('use slashcommands')
	}

	async execSlash(message: RainMessage, args: { user: RainUser; reason?: string; time: string }) {
		if ((await (message.guild as RainGuild).database('guildSettings.muteRole')) === null) {
			return await message.reply({
				content: "This guild doesn't have a muted role set up! Please set one through `/config`, or set one yourself with `/setMuteRole` (when that becomes a thing).",
				ephemeral: true,
			})
		}
		let member
		try {
			member = (await message.guild?.members.fetch(args.user)) as RainMember
		} catch (err) {
			if (!member) return await message.reply({ content: "I couldn't find that person. Most likely they aren't on the server.", ephemeral: true })
		}
		if (!(message.member as RainMember).hasRolePriority(member))
			return await message.reply({ content: `You can't mute **${args.user.tag}**, as their highest role is higher than yours.`, ephemeral: true })
		let time = null

		if (args.time) {
			time = this.client.time(args.time) + Utils.now
			if (isNaN(time)) return await message.reply({ content: "That time isn't valid!", ephemeral: true })
		}

		const muted = time ? await member.mute(time) : await member.mute()
		if (muted === false) return await message.reply({ content: "There was an error while trying to mute the member. This hasn't been saved to modlogs.", ephemeral: true })

		const addedModlog = await args.user.addModlogEntry(message.guildId as Snowflake, 'MUTE', message.author.id, { reason: args.reason, duration: time ? `${time}` : undefined })
		if (addedModlog === false) {
			await member.unmute()
			return await message.reply({
				content: 'There was an error while adding the modlog entry for that member. They have been unmuted.',
				ephemeral: true,
			})
		}
		try {
			await args.user.send(
				time
					? `You have been muted in **${message.guild?.name}** until <t:${time}> ${args.reason ? `for ${args.reason}` : 'without a reason.'}`
					: `You have been permanently muted in **${message.guild?.name}** ${args.reason ? `for ${args.reason}` : 'without a reason.'}`
			)
		} catch (err) {
			return await message.reply({ content: `I couldn't DM **${args.user.tag}**, but I muted them ${time ? `until <t:${time}>.` : `permanently.`}` })
		}
		await message.reply({ content: `**${args.user.tag}** has been ${time ? `temporarily muted until <t:${time}>` : `permanently muted.`}` })
	}
}

import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { RainGuild } from '@extensions/discord.js/Guild'
import { RainMember } from '@extensions/discord.js/GuildMember'
import { DRainMessage } from '@extensions/discord.js/Message'
import { RainUser } from '@extensions/discord.js/User'
import { RainCommand } from '@extensions/RainCommand'
import Utils from '@functions/utils'

export default class Mute extends RainCommand {
	constructor() {
		super('mute', {
			commandType: 'mute',
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
		const member = (await message.guild?.members.fetch(args.user)) as RainMember
		let time = null

		if (args.time) {
			time = this.client.time(args.time) + Utils.now
			if (isNaN(time)) return await message.reply({ content: "That time isn't valid!", ephemeral: true })
		}

		const muted = time ? await member.mute(time) : await member.mute()
		const addedModlog = await member.addModlogEntry('MUTE', message.author.id, { reason: args.reason, duration: time ? `${time}` : undefined })

		if (muted === false) return await message.reply({ content: "There was an error while trying to mute the member. This hasn't been saved to modlogs.", ephemeral: true })
		if (addedModlog === false) {
			await member.unmute()
			return await message.reply({ content: 'There was an error while adding the modlog entry for that member, but they have still been muted.', ephemeral: true })
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

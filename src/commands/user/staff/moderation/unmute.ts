import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { RainGuild } from '@extensions/discord.js/Guild'
import { RainMember } from '@extensions/discord.js/GuildMember'
import { DRainMessage } from '@extensions/discord.js/Message'
import { RainUser } from '@extensions/discord.js/User'
import { RainCommand } from '@extensions/RainCommand'
import Utils from '@functions/utils'
import { Snowflake } from 'discord.js'

export default class Unmute extends RainCommand {
	constructor() {
		super('unmute', {
			aliases: ['unmute'],
			description: 'Unmute a user.',
			discordPerms: ['MANAGE_MESSAGES'],
			defaultPerms: 'helper',
			slash: true,
			slashOptions: [
				{
					name: 'user',
					description: 'The user to unmute',
					type: 'USER',
					required: true,
				},
				{
					name: 'reason',
					description: 'The reason the user is getting unmuted.',
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

	async execSlash(message: RainMessage, args: { user: RainUser; reason?: string }) {
		if ((await (message.guild as RainGuild).database('guildSettings.muteRole')) === null) {
			return await message.reply({
				content: "This guild doesn't have a muted role set up! Please set one through `/config`, or set one yourself with `/setMuteRole` (when that becomes a thing).",
				ephemeral: true,
			})
		}
		const member = (await message.guild?.members.fetch(args.user)) as RainMember
		const unmuted = await member.unmute()
		if (unmuted === false) return await message.reply({ content: 'I failed to unmute that person.', ephemeral: true })

		const modlogAdded = await args.user.addModlogEntry(message.guild?.id as string, 'UNMUTE', message.author.id, { reason: args.reason })
		if (modlogAdded === false) await message.reply({ content: 'There was an error while adding the modlog entry for that user, but they have been unmuted.', ephemeral: true })

		try {
			await args.user.send(`You have been unmuted in **${message.guild?.name}**${args.reason ? ` for ${args.reason}` : '.'}`)
			await message.reply(`**${args.user.tag}** has been unmuted.`)
		} catch (err) {
			await message.reply(`**${args.user.tag}** has been unmuted, but I couldn't DM them.`)
		}
	}
}

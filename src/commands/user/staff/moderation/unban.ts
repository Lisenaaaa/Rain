import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { RainGuild } from '@extensions/discord.js/Guild'
import { DRainMessage } from '@extensions/discord.js/Message'
import { RainUser } from '@extensions/discord.js/User'
import { RainCommand } from '@extensions/RainCommand'
import Utils from '@functions/utils'

export default class Unban extends RainCommand {
	constructor() {
		super('unban', {
			aliases: ['unban'],
			description: 'Unban a user.',
			discordPerms: ['BAN_MEMBERS'],
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
			rainPerms: ['BAN_MEMBERS'],
		})
	}
	async exec(message: DRainMessage) {
		await message.reply('use slashcommands')
	}

	async execSlash(message: RainMessage, args: { user: RainUser; reason?: string }) {
		try {
			await message.guild?.members.fetch(args.user)
			return await message.reply({ content: "That user isn't banned!", ephemeral: true })
		} catch (err) {
			const unbanned = await (message.guild as RainGuild).unban(args.user, `${message.author.id} | ${args.reason ? args.reason : 'No reason provided.'}`)
			if (unbanned === false) return await message.reply({ content: 'I failed to unban that person.', ephemeral: true })

			const modlogAdded = await args.user.addModlogEntry(message.guild?.id as string, 'UNBAN', message.author.id, { reason: args.reason })
			if (modlogAdded === false) await message.reply({ content: 'There was an error while adding the modlog entry for that user, but they have been unmuted.', ephemeral: true })

			try {
				await args.user.send(`You have been unbanned in **${message.guild?.name}**${args.reason ? ` for ${args.reason}` : '.'}`)
			} catch (err) {
				/*do nothing*/
			}
			await message.reply(`**${args.user.tag}** has been unbanned.`)
		}
	}
}

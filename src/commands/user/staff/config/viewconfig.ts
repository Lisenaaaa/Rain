import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { RainGuild } from '@extensions/discord.js/Guild'
import { DRainMessage } from '@extensions/discord.js/Message'
import { RainCommand } from '@extensions/RainCommand'
import Utils from '@functions/utils'
import { GuildDatabase } from '@src/types/database'
import { MessageEmbed } from 'discord.js'

export default class ViewConfig extends RainCommand {
	constructor() {
		super('viewconfig', {
			aliases: ['viewconfig'],
			description: "View the server's config.",
			discordPerms: ['MANAGE_MESSAGES'],
			defaultPerms: 'trialHelper',
			slash: true,
			slashGuilds: Utils.slashGuilds,
			rainPerms: ['SEND_MESSAGES'],
		})
	}
	async exec(message: DRainMessage) {
		await message.reply('use slashcommands')
	}

	async execSlash(message: RainMessage) {
		const database = (await (message.guild as RainGuild).database()) as GuildDatabase

		const embed = {
			title: `${message.guild?.name}'s configuration`,
			fields: [
				{
					name: 'Muted Role',
					value: database.guildSettings.muteRole
						? message.guild?.roles.cache.get(database.guildSettings.muteRole)?.toString()
						: "**This guild doesn't have a mute role set. Please set one through `/config` or `/setmuterole`**",
				},
				{
					name: 'Staff Roles',
					value: `
                    Owner: ${database.guildSettings.staffRoles.owner ? message.guild?.roles.cache.get(database.guildSettings.staffRoles.owner)?.toString() : 'Role not set.'}
                    Admin: ${database.guildSettings.staffRoles.admin ? message.guild?.roles.cache.get(database.guildSettings.staffRoles.admin)?.toString() : 'Role not set.'}
                    Sr. Mod: ${database.guildSettings.staffRoles.srMod ? message.guild?.roles.cache.get(database.guildSettings.staffRoles.srMod)?.toString() : 'Role not set.'}
                    Moderator: ${database.guildSettings.staffRoles.moderator ? message.guild?.roles.cache.get(database.guildSettings.staffRoles.moderator)?.toString() : 'Role not set.'}
                    Helper: ${database.guildSettings.staffRoles.helper ? message.guild?.roles.cache.get(database.guildSettings.staffRoles.helper)?.toString() : 'Role not set.'}
                    Trial Helper: ${database.guildSettings.staffRoles.trialHelper ? message.guild?.roles.cache.get(database.guildSettings.staffRoles.trialHelper)?.toString() : 'Role not set.'}`,
				},
			],
		}

		await message.reply({ embeds: [embed as MessageEmbed] })
	}
}

import { RainGuild } from '@extensions/discord.js/Guild'
import { RainMember } from '@extensions/discord.js/GuildMember'
import { RainUser } from '@extensions/discord.js/User'
import { RainCommand } from '@extensions/RainCommand'
import { RainInhibitor } from '@extensions/RainInhibitor'
import Utils from '@functions/utils'
import { AkairoMessage, GuildTextBasedChannels } from 'discord-akairo'
import { Message, PermissionString, Snowflake } from 'discord.js'

export default class CommandHandlerInhibitor extends RainInhibitor {
	constructor() {
		super('commandHandler', {
			reason: 'commandHandler',
		})
	}

	async exec(message: Message | AkairoMessage, command: RainCommand) {
		// if (!(message.author as RainUser).owner) {
		// 	await message.reply({ content: "Sorry, but I'm being developed right now, so all of my commands are locked.", ephemeral: true })
		// 	return true
		// }

		console.log((message.author as RainUser).owner)

		//if (command.ownerOnly && (message.author as RainUser).owner) return false

		const rain = await message.guild?.members.fetch(this.client.user?.id as string)

		const commandEnabledGuild = await command.enabled(message.guild?.id as string)
		const commandEnabledGlobally = await command.enabledGlobally()
		const commandPerms = command.discordPerms as PermissionString[]
		const rainPermsInChannel = rain?.permissionsIn(message.channel as GuildTextBasedChannels).toArray() as PermissionString[]
		const rainHasPermsInChannel = Utils.arrayIncludesAllArray(rainPermsInChannel, commandPerms)
		const memberHasPermsForCommand = (await (message.guild as RainGuild).hasStaffRoles())
			? await (message.member as RainMember).hasPermission(await command.getPerms(message.guildId as Snowflake))
			: Utils.arrayIncludesAllArray((message.member as RainMember).permissions.toArray(), commandPerms)

		const { debugLog } = this.client

		debugLog('user', message.author.tag)
		debugLog('commandId', command.id)
		debugLog('commandEnabled', commandEnabledGuild)
		debugLog('commandEnabledGlobally', commandEnabledGlobally)
		debugLog('rainHasPermsInChannel', rainHasPermsInChannel)
		debugLog('memberHasPermsForCommand', memberHasPermsForCommand)
		debugLog('                    ', '')

		if (!commandEnabledGlobally) {
			await message.reply({
				content: "This command is disabled globally, probably for a really good reason. It won't work, and there's nothing anyone but my owner can do about it.",
				ephemeral: true,
			})
			return true
		}
		if (!commandEnabledGuild) {
			await message.reply({
				content: "This command is disabled.",
				ephemeral: true,
			})
			return true
		}
		if (!rainHasPermsInChannel) {
			await message.reply({
				content: "I don't have the proper permissions to run this command. Please yell at Raine, my developer, to make this error show the perms that are missing.",
				ephemeral: true,
			})
			return true
		}
		if (!memberHasPermsForCommand) {
			await message.reply({
				content: "You don't have the proper permissions to run this command. Please yell at Raine, my developer, to make this error show the perms that are missing.",
				ephemeral: true,
			})
			return true
		}

		return false //(await (message.member as RainMember).hasPermission(channelPerms as perms)) ? false : true
	}
}

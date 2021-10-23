import { RainChannel } from '@extensions/discord.js/Channel'
import { RainMember } from '@extensions/discord.js/GuildMember'
import { RainUser } from '@extensions/discord.js/User'
import { RainCommand } from '@extensions/RainCommand'
import { RainInhibitor } from '@extensions/RainInhibitor'
import Utils from '@functions/utils'
import { perms } from '@src/types/misc'
import { AkairoMessage, GuildTextBasedChannels } from 'discord-akairo'
import { Message, PermissionString } from 'discord.js'

export default class CommandHandlerInhibitor extends RainInhibitor {
	constructor() {
		super('commandHandler', {
			reason: 'commandHandler',
		})
	}

	async exec(message: Message | AkairoMessage, command: RainCommand) {
		if (!(message.author as RainUser).owner) {
			await message.reply({ content: "Sorry, but I'm being developed right now, so all of my commands are locked.", ephemeral: true })
			return true
		}

		if (command.ownerOnly && !(message.author as RainUser).owner) {
			await message.reply({
				content: "Hey, you aren't my owner!",
				ephemeral: true,
			})
			return true
		}

		if (command.ownerOnly && (message.author as RainUser).owner) return false

		const rain = await message.guild?.members.fetch(this.client.user?.id as string)

		const channelPerms = await (message.channel as RainChannel).getRestrictedPerms()
		const commandEnabledGuild = await command.enabled(message.guild?.id as string)
		const commandEnabledGlobally = await command.enabledGlobally()
		const memberHasPermsInChannel = await (message.member as RainMember).hasPermission(channelPerms as perms)
		const commandPerms = command.rainPerms as PermissionString[]
		const rainPermsInChannel = rain?.permissionsIn(message.channel as GuildTextBasedChannels).toArray() as PermissionString[]
		const rainHasPermsInChannel = Utils.arrayIncludesAllArray(rainPermsInChannel, commandPerms)

		const { debug, debugLog } = this.client

		if (debug) {
			debugLog('commandId', command.id)
			debugLog('commandEnabled', commandEnabledGuild)
			debugLog('commandEnabledGlobally', commandEnabledGlobally)
			debugLog('memberHasPermsInChannel', memberHasPermsInChannel)
			debugLog('rainHasPermsInChannel', rainHasPermsInChannel)
			console.log('\n')
		}
		return false //(await (message.member as RainMember).hasPermission(channelPerms as perms)) ? false : true
	}
}

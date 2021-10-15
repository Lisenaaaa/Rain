import { RainChannel } from '@extensions/discord.js/Channel'
import { RainGuild } from '@extensions/discord.js/Guild'
import { RainMember } from '@extensions/discord.js/GuildMember'
import { RainUser } from '@extensions/discord.js/User'
import { RainCommand } from '@extensions/RainCommand'
import { RainInhibitor } from '@extensions/RainInhibitor'
import { perms } from '@src/types/misc'
import { AkairoMessage } from 'discord-akairo'
import { Message } from 'discord.js'

export default class CommandHandlerInhibitor extends RainInhibitor {
	constructor() {
		super('commandHandler', {
			reason: 'commandHandler',
		})
	}

	async exec(message: Message | AkairoMessage, command: RainCommand) {
		if (command.ownerOnly && !(message.author as RainUser).isOwner()) {
			await message.reply({
				content: "Hey, you aren't my owner!",
				ephemeral: true,
			})
			return false
		}
		const { debugLog } = this.client
		const debug = true

		const channelPerms = await (message.channel as RainChannel).getRestrictedPerms()
		const commandEnabledGuild = await command.enabled(message.guild?.id as string)
		const commandEnabledGlobally = await command.enabledGlobally()
		const memberHasPermsInChannel = await (message.member as RainMember).hasPermission(channelPerms as perms)

		if (debug) {
			debugLog('commandId', command.id)
			debugLog('commandEnabled', commandEnabledGuild)
			debugLog('commandEnabledGlobally', commandEnabledGlobally)
			debugLog('memberHasPermsInChannel', memberHasPermsInChannel)
			console.log('\n')
		}
		return false//(await (message.member as RainMember).hasPermission(channelPerms as perms)) ? false : true
	}
}

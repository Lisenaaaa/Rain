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
		const staffRoles = (await (message.guild as RainGuild).database())?.guildSettings.staffRoles
		const channelPerms = await (message.channel as RainChannel).getRestrictedPerms()

		if (debug) {
			debugLog('commandId', command.id)
			debugLog('staffRoles', staffRoles)
			debugLog('channelPerms', channelPerms)
			debugLog('commandEnabled', await command.enabled(message.guild?.id as string))
			debugLog('member can use commands in channel', await (message.member as RainMember).hasPermission(channelPerms as perms))
			console.log('\n')
		}
		return false//(await (message.member as RainMember).hasPermission(channelPerms as perms)) ? false : true
	}
}

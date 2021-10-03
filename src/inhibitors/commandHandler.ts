import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { RainChannel } from '@extensions/discord.js/Channel'
import { RainGuild } from '@extensions/discord.js/Guild'
import { RainMember } from '@extensions/discord.js/GuildMember'
import { RainCommand } from '@extensions/RainCommand'
import { RainInhibitor } from '@extensions/RainInhibitor'
import { perms } from '@src/types/misc'

export default class CommandHandlerInhibitor extends RainInhibitor {
	constructor() {
		super('commandHandler', {
			reason: 'commandHandler',
		})
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async exec(message: RainMessage, command: RainCommand) {
		const { debugLog } = this.client
		const debug = true
		const staffRoles = (await (message.guild as RainGuild).database())?.guildSettings.staffRoles
		const channelPerms = await (message.channel as RainChannel).getRestrictedPerms()

		if (debug) {
			debugLog('staffRoles', staffRoles)
			debugLog('channelPerms', channelPerms)
			debugLog('member can use commands in channel', await (message.member as RainMember).hasPermission(channelPerms as perms))
			console.log('\n\n')
		}
		return await (message.member as RainMember).hasPermission(channelPerms as perms)
	}
}

import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { DRainMessage } from '@extensions/discord.js/Message'
import { RainCommand } from '@extensions/RainCommand'
import utils from '@functions/utils'
import { Channel } from 'discord.js'

export default class SetLogCommand extends RainCommand {
	constructor() {
		super('setLogChannel', {
			aliases: ['setLogChannel'],
			slash: true,
			slashGuilds: utils.slashGuilds,
			description: 'set a channel for me to log stuff in',
			slashOptions: [
				{
					name: 'type',
					type: 'STRING',
					description: 'The permissions that you would like to restrict commands in the channel to.',
					choices: [
						{ name: 'owner', value: 'owner' },
						{ name: 'admin', value: 'admin' },
						{ name: 'sr. mod', value: 'srMod' },
						{ name: 'moderator', value: 'moderator' },
						{ name: 'helper', value: 'helper' },
						{ name: 'trial helper', value: 'helper' },
					],
					required: true,
				},
				{
					name: 'channel',
					type: 'CHANNEL',
					description: 'The channel you would like to restrict commands in.',
					required: true,
				},
			],
			defaultPerms: 'srMod',
			rainPerms: []
		})
	}

	async exec(message: DRainMessage) {
		await message.reply('Please use this as a slashcommand.')
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execSlash(message: RainMessage, { perms, channel }: { perms: string; channel: Channel }) {
		//e
	}
}

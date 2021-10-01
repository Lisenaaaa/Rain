import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { dRainMessage, } from '@extensions/discord.js/Message'
import { RainCommand } from '@extensions/RainCommand'
import utils from '@functions/utils'
import { Channel } from 'discord.js'

export default class extends RainCommand {
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
		})
	}

	async exec(message: dRainMessage) {
		await message.reply('Please use this as a slashcommand.')
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execSlash(message: RainMessage, { perms, channel }: { perms: string; channel: Channel }) {
		//e
	}
}

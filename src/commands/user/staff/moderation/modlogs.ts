import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { DRainMessage } from '@extensions/discord.js/Message'
import { RainUser } from '@extensions/discord.js/User'
import { RainCommand } from '@extensions/RainCommand'
import Utils from '@functions/utils'

export default class Modlogs extends RainCommand {
	constructor() {
		super('modlogs', {
			aliases: ['modlogs'],
			args: [{ id: 'user', type: 'user' }],
			description: "Views a user's modlogs",
			discordPerms: ['MANAGE_MESSAGES'],
			defaultPerms: 'trialHelper',
            slash:true,
            slashOptions: [
                {
                    name: 'user',
                    description: 'The user to view the modlogs of',
                    type: 'USER',
                    required: true
                }
            ],

            slashGuilds: Utils.slashGuilds
		})
	}

    async exec(message: DRainMessage) {await message.reply('slashcommands only :)')}

	async execSlash(message: RainMessage, args: { user: RainUser }) { // eslint-disable-line @typescript-eslint/no-unused-vars
		await message.reply('sex.')
	}
}

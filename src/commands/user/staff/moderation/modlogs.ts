import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { RainMember } from '@extensions/discord.js/GuildMember'
import { DRainMessage } from '@extensions/discord.js/Message'
import { RainUser } from '@extensions/discord.js/User'
import { RainCommand } from '@extensions/RainCommand'
import Utils from '@functions/utils'
import { modlogs } from '@src/types/misc'

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
		const modlogs = await (await message.guild?.members.fetch(args.user.id) as RainMember).getModlogs()
		if (modlogs === undefined) return await message.reply('That user has no modlogs!')

		const firstModlog = modlogs[0]

		const firstModlogFormatted = `
ID: \`${firstModlog.id}\`
Type: ${firstModlog.type}
Reason: ${firstModlog.reason}
Responsible Moderator: ${await this.client.users.fetch(firstModlog.modID)} (${await (await this.client.users.fetch(firstModlog.modID)).tag})
${firstModlog.duration ? `Expires: <t:${firstModlog.duration}:R>` : ``}
		`

		await message.reply({content: firstModlogFormatted, allowedMentions: {parse: []}})
	}
}

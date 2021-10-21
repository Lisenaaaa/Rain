import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { RainMember } from '@extensions/discord.js/GuildMember'
import { DRainMessage } from '@extensions/discord.js/Message'
import { RainUser } from '@extensions/discord.js/User'
import { RainCommand } from '@extensions/RainCommand'
import Utils from '@functions/utils'
import { MessageEmbedOptions } from 'discord.js'

export default class Modlogs extends RainCommand {
	constructor() {
		super('modlogs', {
			aliases: ['modlogs'],
			args: [{ id: 'user', type: 'user' }],
			description: "Views a user's modlogs",
			discordPerms: ['MANAGE_MESSAGES'],
			defaultPerms: 'trialHelper',
			slash: true,
			slashOptions: [
				{
					name: 'user',
					description: 'The user to view the modlogs of',
					type: 'USER',
					required: true,
				},
			],
			slashGuilds: Utils.slashGuilds,
		})
	}

	async exec(message: DRainMessage) {
		await message.reply('slashcommands only :)')
	}

	async execSlash(message: RainMessage, args: { user: RainUser }) {
		const modlogs = await ((await message.guild?.members.fetch(args.user.id)) as RainMember).getModlogs()
		if (modlogs === undefined) return await message.reply('That user has no modlogs!')

		const allModlogs = []
		for (const modlog of modlogs) {
			const formattedModlog = `ID: \`${modlog.id}\`\nType: ${modlog.type.toLowerCase()}\nReason: ${modlog.reason}\nModerator: ${await this.client.users.fetch(modlog.modID)} (${await (
				await this.client.users.fetch(modlog.modID)
			).tag})${modlog.duration ? `\nExpires: <t:${modlog.duration}:R>` : ``}\nCreated at <t:${modlog.createdTimestamp}>`

			allModlogs.push(formattedModlog)
		}

		const newModlogArray = Utils.splitArrayIntoMultiple(allModlogs, 6)
		const embedsArray: MessageEmbedOptions[] = []

		for (const modlogs of newModlogArray) {
			let modlogString = ''
			for (const modlog of modlogs) {
				if (modlogString.length === 0) modlogString += modlog
				else modlogString += `\n-------------------------------------\n${modlog}`
			}

			embedsArray.push({title: `${args.user.tag}'s modlogs`, description: modlogString})
		}

		await message.paginate(embedsArray)
	}
}

import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { RainMember } from '@extensions/discord.js/GuildMember'
import { DRainMessage } from '@extensions/discord.js/Message'
import { RainUser } from '@extensions/discord.js/User'
import { RainCommand } from '@extensions/RainCommand'

export default class Warn extends RainCommand {
	constructor() {
		super('warn', {
			aliases: ['warn'],
			description: 'Warn a user.',
			discordPerms: ['MANAGE_MESSAGES'],
			defaultPerms: 'trialHelper',
			slash: true,
			slashOptions: [
				{
					name: 'user',
					description: 'The user to warn',
					type: 'USER',
					required: true,
				},
				{
					name: 'reason',
					description: 'What you want to warn the user for',
					type: 'STRING',
					required: true,
				},
			],
		})
	}
	async exec(message: DRainMessage) {
		await message.reply('use slashcommands')
	}

	async execSlash(message: RainMessage, args: { user: RainUser; reason: string }) {
		const addedModlog = await ((await message.guild?.members.fetch(args.user)) as RainMember).addModlogEntry('WARN', message.author.id, {reason: args.reason})
		if (addedModlog === true) {
			try {
				await args.user.send(`You have been warned in **${message.guild?.name}** for ${args.reason}`)
                await message.reply(`**${args.user.tag}** has been warned.`)
			} catch (err) {
                await message.reply({content: `I couldn't DM **${args.user.tag}**. This warning has been saved to their modlogs.`})
            }
		}
        else {
            await message.reply('There was an error saving the modlog entry. This warning has not been saved, and the user has not been messaged.')
        }
	}
}

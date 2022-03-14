import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction } from 'discord.js'
import got from 'got/dist/source'
import RainCommand from '../../structures/RainCommand'

// this command's name is completely intentional

@ApplyOptions<CommandOptions>({
	name: 'car',
	aliases: ['car'],
	description: 'sends a cat picture',
	preconditions: ['slashOnly', 'permissions'],
	botPerms: ['EMBED_LINKS'],
	defaultPermissions: 'none',
	slashOptions: {
		guildIDs: ['880637463838724166'],
		idHints: ['939680586669371463'],
	},
})
export class CarCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		// this api was the first result on google for "cat picture api", i know nothing about it other than the tiny little bit on their website saying how to get a random cat image
		await interaction.reply((await JSON.parse((await got.get('https://api.thecatapi.com/v1/images/search')).body))[0].url)
	}
}

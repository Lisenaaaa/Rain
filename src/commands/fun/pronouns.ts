import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction } from 'discord.js'
import RainCommand from '../../structures/RainCommand'
import { ArgsUser } from '../../types/misc'

@ApplyOptions<CommandOptions>({
	name: 'pronouns',
	aliases: ['pronouns'],
	description: 'see someones pronouns',
	preconditions: ['slashOnly', 'permissions'],
	botPerms: ['EMBED_LINKS'],
	defaultPermissions: 'none',
	slashOptions: {
		guildIDs: ['880637463838724166'],
		idHints: ['966547081168838787'],
		options: [
			{
				name: 'user',
				description: 'The user you want to know the pronouns of',
				type: 'USER',
				required: false,
			},
		],
	},
})
export class PronounsCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const args: { user?: ArgsUser } = this.container.utils.parseInteractionArgs(interaction)

		const pronouns = await this.container.users.getPronouns(args.user ? args.user.user : interaction.user)

		await interaction.reply(`${pronouns}`)
	}
}

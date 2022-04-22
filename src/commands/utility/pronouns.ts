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
		guildIDs: RainCommand.guildIDs(),
		idHints: ['966547081168838787', '966784339423682580', '967144409026166824'],
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
		const user = args.user ? args.user.user : interaction.user
		await interaction.deferReply()

		const pronouns = await this.container.users.getPronouns(user)

		await interaction.editReply({ embeds: [{ title: `${user.tag}'s pronouns`, description: `${pronouns}` }] })
	}
}

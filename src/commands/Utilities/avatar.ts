import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction } from 'discord.js'
import RainCommand from '../../structures/RainCommand'
import { ArgsUser } from '../../types/misc'

@ApplyOptions<CommandOptions>({
	name: 'avatar',
	aliases: ['avatar'],
	description: 'see someones pfp',
	preconditions: ['slashOnly', 'permissions'],
	botPerms: ['EMBED_LINKS'],
	defaultPermissions: 'none',
	slashOptions: {
		guildIDs: ['880637463838724166'],
		idHints: ['938245981076607066'],
		options: [
			{
				name: 'user',
				description: 'The user you want to get the pfp from',
				type: 'USER',
				required: true,
			},
		],
	},
})
export class AvatarCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const args: { user: ArgsUser } = this.container.utils.parseInteractionArgs(interaction)
		const user = args.user.user

		if (args.user.member && args.user.member.avatarURL({ dynamic: true, format: 'png', size: 512 })) {
			return await interaction.reply({
				embeds: [
					{
						title: `${user.tag}'s Avatars`,
						image: { url: args.user.member.avatarURL({ dynamic: true, format: 'png', size: 512 }) as string },
						thumbnail: { url: user.displayAvatarURL({ dynamic: true, format: 'png', size: 512 }) },
					},
				],
			})
		}

		await interaction.reply({ embeds: [{ title: `${user.tag}'s Avatar`, image: { url: user.displayAvatarURL({ dynamic: true, format: 'png', size: 512 }) } }] })
	}
}

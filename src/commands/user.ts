import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction, GuildMember } from 'discord.js'
import RainCommand from '../structures/RainCommand'
import { ArgsUser } from '../types/misc'

@ApplyOptions<CommandOptions>({
	name: 'user',
	aliases: ['user'],
	description: 'see info about someone',
	preconditions: ['slashOnly', 'permissions'],
	botPerms: ['EMBED_LINKS'],
	defaultPermissions: 'none',
	slashOptions: {
		guildIDs: ['880637463838724166'],
		idHints: ['938588224283086888'],
		options: [
			{
				name: 'user',
				description: 'The user you want to get info about',
				type: 'USER',
				required: false,
			},
		],
	},
})
export class AvatarCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply()
		const args: { user?: ArgsUser } = this.container.utils.parseInteractionArgs(interaction)
		const user = args.user?.user ?? interaction.user
		let member: GuildMember | undefined
		if (args.user?.user) member = args.user.member
		else member = (interaction.member as GuildMember) ?? undefined
		let pronouns = await this.container.users.getPronouns(user)
		if (pronouns === 'Unspecified') pronouns = undefined

		await interaction.editReply({
			embeds: [
				{
					title: `${user.tag}`,
					thumbnail: { url: `${member ? member.displayAvatarURL({ dynamic: true, format: 'png', size: 128 }) : user.displayAvatarURL({ dynamic: true, format: 'png', size: 128 })}` },
					description: `**Mention**: ${user}${pronouns ? `\n**Pronouns**: ${pronouns}` : ''}
                    **Created at** <t:${Math.floor(user.createdTimestamp / 1000)}:F>
                    ${member ? `**Joined at** <t:${Math.floor((member.joinedTimestamp ?? member.guild.createdTimestamp) / 1000)}:F>` : ''}
					${
						member
							? `
					
					**Roles**: ${member.roles.cache
						.filter((r) => r.id != r.guild.id)
						.sort((r1, r2) => r2.rawPosition - r1.rawPosition)
						.map((r) => r.toString())}
					**Discord Perms**: ${this.container.members.importantPerms(member).toString()}
					`
							: ''
					}
                    `,
				},
			],
		})
	}
}

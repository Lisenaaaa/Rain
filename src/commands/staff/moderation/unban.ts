import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction, Guild, GuildMember } from 'discord.js'
import RainCommand from '../../../structures/RainCommand'
import { ArgsUser } from '../../../types/misc'

@ApplyOptions<CommandOptions>({
	name: 'unban',
	aliases: ['unban'],
	description: 'unban a member',
	preconditions: ['slashOnly', 'permissions', 'GuildOnly'],
	defaultPermissions: 'moderator',
	botPerms: ['BAN_MEMBERS'],
	slashOptions: {
		guildIDs: ['880637463838724166'],
		idHints: ['936396772606111824'],
		options: [
			{ name: 'member', type: 'USER', description: 'the member you want to unban', required: true },
			{ name: 'reason', type: 'STRING', description: 'the reason to unban them for' },
		],
	},
})
export class UnbanCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const args: { member: ArgsUser; reason?: string } = this.parseArgs(interaction)
		const moderator = interaction.member as GuildMember

		try {
			await args.member.user.send(`You have been unbanned in **${interaction.guild?.name}${args.reason ? ` for ${args.reason}` : '.'}`)
		} catch (err) {
			/* do nothing lol */
		}

		const banned = await this.container.guilds.unban(interaction.guild as Guild, args.member.user, args.reason)

		if (banned) {
			await this.container.users.addModlogEntry(args.member.user, interaction.guild?.id as string, 'UNBAN', moderator.user.id, {
				reason: args.reason,
			})

			await interaction.reply({
				content: `I've unbanned ${args.member.user.tag}${args.reason ? ` for ${args.reason}` : '.'}`,
				ephemeral: true,
			})

			this.container.client.emit('memberUnbanned', { member: args.member.user, moderator: moderator, reason: args.reason })
		} else {
			await interaction.reply({ content: `Something went wrong while unbanning ${args.member.user.tag}.` })
		}
	}
}

export type MemberUnbanData = {
	member: GuildMember
	moderator: GuildMember
	reason?: string
}

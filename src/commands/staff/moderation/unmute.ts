import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction, GuildMember } from 'discord.js'
import RainCommand from '../../../structures/RainCommand'
import { ArgsUser } from '../../../types/misc'

@ApplyOptions<CommandOptions>({
	name: 'unmute',
	aliases: ['unmute'],
	description: 'unmute a member',
	preconditions: ['slashOnly', 'permissions', 'GuildOnly'],
	defaultPermissions: 'helper',
	botPerms: ['MANAGE_ROLES'],
	slashOptions: {
		guildIDs: ['880637463838724166'],
		idHints: ['935677351960928266'],
		options: [
			{ name: 'member', type: 'USER', description: 'the member you want to unmute', required: true },
			{ name: 'reason', type: 'STRING', description: 'the reason to unmute them for' },
		],
	},
})
export class UnmuteCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const args: { member: ArgsUser; reason?: string } = this.parseArgs(interaction)
		const target = args.member.member
		const moderator = interaction.member as GuildMember

		if (!target) {
			return await interaction.reply({ content: "I can't mute someone who isn't on the server.", ephemeral: true })
		}

		if (this.container.utils.checkPermHeirarchy(await this.container.members.getPerms(target), await this.container.members.getPerms(moderator))) {
			await interaction.reply({ content: `You can't unmute someone with higher or equal permissions to you.`, ephemeral: true })
		}

		if (this.container.members.isMuted(target)) {
			return await interaction.reply({ content: "You can't unmute someone who isn't muted.", ephemeral: true })
		}

		if (!this.container.cache.guilds.get(interaction.guild?.id as string)?.guildSettings.muteRole) throw new Error("I can't unmute people without having a role set to remove from them.")
		const muteRole = await interaction.guild?.roles.fetch(this.container.cache.guilds.get(interaction.guild?.id as string)?.guildSettings.muteRole as string)
		if (!muteRole) throw new Error("I can't unmute people without having a role set to remove from them.")

		const muted = await this.container.members.unmute(target)

		if (muted) {
			await this.container.users.addModlogEntry(target.user, interaction.guild?.id as string, 'UNMUTE', moderator.user.id, {
				reason: args.reason,
			})
			await args.member.user.send(`You have been unmuted in **${interaction.guild?.name}**${args.reason ? ` for ${args.reason}` : '.'}`)
			await interaction.reply({
				content: `I've unmuted ${target.user.tag}${args.reason ? ` for ${args.reason}` : '.'}`,
				ephemeral: true,
			})

			this.container.client.emit('memberUnmuted', { member: target, moderator: moderator, reason: args.reason })
		} else {
			await interaction.reply({ content: `Something went wrong while unmuting ${target.user.tag}.` })
		}
	}
}

export type MemberUnmuteData = {
	member: GuildMember
	moderator: GuildMember
	reason?: string
}

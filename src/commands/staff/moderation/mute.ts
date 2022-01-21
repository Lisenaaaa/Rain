import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction, GuildMember } from 'discord.js'
import ms from 'ms'
import RainCommand from '../../../structures/RainCommand'
import { ArgsUser } from '../../../types/misc'

@ApplyOptions<CommandOptions>({
	name: 'mute',
	aliases: ['mute'],
	description: 'mute a member',
	preconditions: ['slashOnly', 'permissions', 'GuildOnly'],
	defaultPermissions: 'helper',
	slashOptions: {
		guildIDs: ['880637463838724166'],
		idHints: ['933872679654674442'],
		options: [
			{ name: 'member', type: 'USER', description: 'the member you want to mute', required: true },
			{ name: 'reason', type: 'STRING', description: 'the reason to mute them for' },
			{ name: 'time', type: 'STRING', description: 'the time to mute them for' },
		],
	},
})
export class MuteCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const args: { member: ArgsUser; reason?: string; time?: string } = this.parseArgs(interaction)
		const time = args.time ? ms(args.time) : undefined
		const target = args.member.member
		const moderator = interaction.member as GuildMember

		await interaction.deferReply()

		if (!target) {
			return await interaction.reply({ content: "I can't mute someone who isn't on the server.", ephemeral: true })
		}

		if (this.container.utils.checkPermHeirarchy(await this.container.members.getPerms(target), await this.container.members.getPerms(moderator))) {
			await interaction.deleteReply()
			await interaction.reply({ content: `You can't mute someone with higher or equal permissions to you.`, ephemeral: true })
		}
		if (!this.container.cache.guilds.get(interaction.guild?.id as string)?.guildSettings.muteRole) throw new Error("I can't mute people without having a role set to mute them with.")
		const muteRole = await interaction.guild?.roles.fetch(this.container.cache.guilds.get(interaction.guild?.id as string)?.guildSettings.muteRole as string)
		if (!muteRole) throw new Error("I can't mute people without having a role set to mute them with.")

		let muted: boolean
		time ? (muted = await this.container.members.mute(target, time)) : (muted = await this.container.members.mute(target))

		if (muted) {
			await this.container.users.addModlogEntry(target.user, interaction.guild?.id as string, 'MUTE', moderator.user.id, { reason: args.reason, duration: time?.toString() })
			await args.member.user.send(`You have been muted in **${interaction.guild?.name}**${time ? `until <t:${time}:F>` : 'forever.'}`)
			await interaction.deleteReply()
			await interaction.reply({ content: `I've muted ${target.user.tag} ${time ? `until <t:${time}:F>` : 'forever'}, ${args.reason ? `for ${args.reason}` : 'without a reason.'}` })

			this.container.client.emit('memberMuted', { member: target, moderator: moderator, reason: args.reason, time })
		} else {
			await interaction.deleteReply()
			await interaction.reply({ content: `Something went wrong while muting ${target.user.tag}.` })
		}
	}
}

export type MemberMuteData = {
	member: GuildMember
	moderator: GuildMember
	reason?: string
	time?: number
}

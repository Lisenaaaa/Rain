import { Precondition, PreconditionResult } from '@sapphire/framework'
import { CommandInteraction, Guild, GuildMember, Message, TextChannel } from 'discord.js'

export class PermissionsPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		const channel = interaction.channel as TextChannel
		const guild = interaction.guild as Guild
		const member = interaction.member as GuildMember

		return await this.run(guild, channel, member)
	}

	public override async messageRun(message: Message) {
		const channel = message.channel as TextChannel
		const guild = message.guild as Guild
		const member = message.member as GuildMember

		return await this.run(guild, channel, member)
	}

	private async run(guild: Guild, channel: TextChannel, member: GuildMember): Promise<PreconditionResult> {
		const channelRequirements = await this.container.channels.getRestrictedPerms(channel) // the permissions the channel needs ('none' if none, `perms` type if some)
		if (channelRequirements === false) {
			throw new Error('Failed to get if a channel is locked to a specific role')
		}
		const memberPerms = await this.container.members.getPerms(member) // the member's permissions ('none' if none, `perms` type if some)
		const memberHasPermissionToUseChannel = await this.container.members.hasPermission(member, channelRequirements)

		console.log({ channelRequirements, memberPerms, memberHasPermissionToUseChannel })

		return this.ok()
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		permissions: never
	}
}

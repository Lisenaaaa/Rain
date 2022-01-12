import { Precondition } from '@sapphire/framework'
import { CommandInteraction, GuildMember, Message, TextChannel, User } from 'discord.js'

export class OwnerOnlyPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		const database = this.container.cache.guilds.get(interaction.guildId as string)
		const channel = interaction.channel as TextChannel
		const guild = interaction.guild
        const member = interaction.member as GuildMember
        const user = interaction.user

        const channelRequirements = await this.container.channels.getRestrictedPerms(channel) // the permissions the channel needs ('none' if none, `perms` type if some)

        const memberPerms = await this.container.members.getPerms(member)

        console.log(memberPerms)

        return this.ok()
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		permissions: never
	}
}

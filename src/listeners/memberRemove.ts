import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { GuildMember, MessageEmbed } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	once: false,
	event: 'guildMemberRemove',
})
export class MemberRemoveListener extends Listener {
	async run(member: GuildMember) {
		if (!(await this.container.database.guilds.findByPk(member.guild.id))) {
			await this.container.database.guilds.create({ id: member.guild.id })
		}

		await this.log(member)
		await this.welcomeMember(member)
	}

	async welcomeMember(member: GuildMember) {
		const database = await this.container.database.guilds.findByPk(member.guild.id)

		const channelID = database?.welcomeChannel
		if (!channelID) return

		const welcomeChannel = await member.guild.channels.fetch(channelID)
		if (!welcomeChannel) return
		if (welcomeChannel.type !== 'GUILD_TEXT') return

		const leaveMessage = database.leaveMessage
		if (!leaveMessage) return

		await welcomeChannel.send(this.formatString(leaveMessage, member))
	}

	async log(member: GuildMember) {
		await this.container.guilds.log(
			member.guild,
			'member',
			new MessageEmbed({
				title: member.user.tag,
				description: `Member left.\nCreated: <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>\nJoined: <t:${Math.floor((member.joinedAt?.getTime() as number) / 1000)}:F>`,
				footer: { text: member.id },
				timestamp: `${this.container.utils.now('milliseconds')}`,
			})
		)
	}

	private formatString(string: string, member: GuildMember) {
		string = string.replaceAll('{user}', member.user.tag)
		string = string.replaceAll('{user.mention}', member.toString())
		string = string.replaceAll('{user.name}', member.user.username)
		string = string.replaceAll('{user.tag}', member.user.discriminator)
		string = string.replaceAll('{user.id}', member.user.id)

		string = string.replaceAll('{guild}', member.guild.name)
		string = string.replaceAll('{guild.size}', member.guild.memberCount.toString())

		return string
	}
}

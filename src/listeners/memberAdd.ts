import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { GuildMember, MessageEmbed } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	once: false,
	event: 'guildMemberAdd',
})
export class MemberAddListener extends Listener {
	async run(member: GuildMember) {
		if (!(await this.container.database.guilds.findByPk(member.guild.id))) {
			await this.container.database.guilds.create({ id: member.guild.id })
		}

		await this.addAltRole(member)
		await this.welcomeMember(member)
		await this.log(member)
	}

	//this just exists for testing stuff so that i don't have to give my alt the role that lets it access my testing channel every time i ban it
	async addAltRole(member: GuildMember) {
		if (member.guild.id != '880637463838724166') return
		if (member.user.id != '545277690303741962') return

		await member.roles.add('880705826627649566')
	}

	async welcomeMember(member: GuildMember) {
		const database = await this.container.database.guilds.findByPk(member.guild.id)

		const channelID = database?.welcomeChannel
		if (!channelID) return

		const welcomeChannel = await member.guild.channels.fetch(channelID)
		if (!welcomeChannel) return
		if (welcomeChannel.type != 'GUILD_TEXT') return

		const welcomeMessage = database.welcomeMessage
		if (!welcomeMessage) return

		await welcomeChannel.send(this.formatString(welcomeMessage, member))
	}

	async log(member: GuildMember) {
		await this.container.guilds.log(
			member.guild,
			'member',
			new MessageEmbed({
				title: member.user.tag,
				description: `Member joined.\nCreated: <t:${member.user.createdTimestamp / 1000}:F>`,
				footer: { text: member.id },
				timestamp: this.container.utils.now('milliseconds'),
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

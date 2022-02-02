import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { GuildMember } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	once: false,
	event: 'guildMemberAdd',
})
export class MemberAddListener extends Listener {
	//@ts-ignore
	private member: GuildMember

	async run(member: GuildMember) {
		if (this.container.cache.guilds.check(member.guild.id) === undefined) {
			await this.container.database.guilds.add(member.guild.id)
		}

		this.member = member

		await this.addAltRole()
		await this.welcomeMember()
	}

	async addAltRole() {
		if (this.member.guild.id != '880637463838724166') return
		if (this.member.user.id != '545277690303741962') return

		await this.member.roles.add('880705826627649566')
	}

	async welcomeMember() {
		const database = this.container.cache.guilds.get(this.member.guild.id)

		const channelID = database?.guildSettings.welcomeChannel
		if (!channelID) return

		const welcomeChannel = await this.member.guild.channels.fetch(channelID)
		if (!welcomeChannel) return
		if (welcomeChannel.type != 'GUILD_TEXT') return

		const welcomeMessage = database.guildSettings.welcomeMessage
		if (!welcomeMessage) return

		await welcomeChannel.send(this.formatString(welcomeMessage, this.member))
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
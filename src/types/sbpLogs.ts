import { container } from '@sapphire/pieces'
import { EmbedFieldData, GuildChannel, InviteResolvable, Message, MessageEmbed, UserResolvable } from 'discord.js'

export type SBPEmbedData = {
	title: string
	url: string
	description: string
	fields: EmbedFieldData[]
	footer: string
	color: string
	timestamp: string
	thumbnail: string
}

export type SBPUserData = {
	name: string
	avatar: string
	isBot: boolean
	isVerified: boolean
	color: string
}

export type SBPMessageData = {
	text: string
	id: string
	embeds: SBPEmbedData[]
	user: SBPUserData
}

export class SBPMessage {
	text: string
	id: string
	embeds: SBPEmbedData[] | SBPEmbed[]
	user: SBPUserData
	constructor(data: SBPMessageData) {
		this.text = data.text
		this.id = data.id
		this.embeds = data.embeds
		this.user = data.user
	}

	async formatInvite(invite: InviteResolvable) {
		//<discord-invite name=\"discord.js - Imagine a bot\" icon=\"https://cdn.discordapp.com/icons/222078108977594368/881b843eb1d5c3bdb21928079d25549f.png\" url=\"https://discord.gg/djs\" online=\"16237\" members=\"59652\" verified=\"true\"></discord-invite>
		const guild = (await container.client.fetchInvite(invite)).guild ?? (await container.client.guilds.fetch('880637463838724166'))

		return `<discord-invite name="${guild.name}" icon="${guild.iconURL()}" url="${this.getInviteCode(invite)}" online="${
			(await (await guild.fetch()).members.fetch()).filter((m) => m.presence?.status !== 'offline').size
		}" members="${(await guild.fetch()).approximateMemberCount}" ${guild.partnered ? 'partnered="true"' : guild.verified ? 'verified="true"' : ''}></discord-invite>`
	}

	getInviteCode(invite: InviteResolvable) {
		if (invite.startsWith('discord.gg')) {
			return `https://${invite}`
		} else if (invite.startsWith('https')) {
			return invite
		} else {
			return `https://discord.gg/${invite}`
		}
	}

	static async formatMessage(message: Message): Promise<SBPMessage> {
		let content = message.content
		// let invites = ''

		if (message.mentions) {
			if (message.mentions.members) {
				for (const [, member] of message.mentions.members) {
					content = content.replace(member.toString(), `<discord-mention>${member.user.tag}</discord-mention>`)
				}
			}

			if (message.mentions.users) {
				for (const [, user] of message.mentions.users) {
					content = content.replace(user.toString(), `<discord-mention>${user.tag}</discord-mention>`)
				}
			}

			if (message.mentions.channels) {
				for (const [, channel] of message.mentions.channels) {
					if (channel instanceof GuildChannel) content = content.replace(channel.toString(), `<discord-mention type="channel">${channel.name}</discord-mention>`)
				}
			}

			if (message.mentions.roles) {
				for (const [, role] of message.mentions.roles) {
					content = content.replace(role.toString(), `<discord-mention type="role" color="${role.hexColor}">${role.name}</discord-mention>`)
				}
			}
		}

		return new SBPMessage({
			user: await SBPUser.convert(message.author),
			embeds: message.embeds.map((e) => SBPEmbed.convert(e)),
			text: content,
			id: message.id,
		})
	}

	formatMention(name: string, type?: string) {
		return `<discord-mention${type ? `type=${type}` : ''}>${name}</discord-mention.`
	}
}

export class SBPEmbed {
	title: string
	url: string
	description: string
	fields: EmbedFieldData[]
	footer: string
	color: string
	timestamp: string
	thumbnail: string
	constructor(data: SBPEmbedData) {
		this.title = data.title
		this.url = data.url
		this.fields = data.fields
		this.description = data.description
		this.footer = data.footer
		this.color = data.color
		this.timestamp = data.timestamp
		this.thumbnail = data.thumbnail
	}

	static convert(embed: MessageEmbed): SBPEmbed {
		return new SBPEmbed({
			title: embed.title ?? '',
			url: embed.url ?? '',
			description: embed.description ?? '',
			fields: embed.fields ?? [],
			footer: embed.footer?.text ?? '',
			color: embed.color?.toString(16) ? `#${embed.color.toString(16)}` : '',
			thumbnail: embed.thumbnail?.proxyURL ?? '',
			timestamp: '',
		})
	}
}

export class SBPUser {
	name: string
	avatar: string
	isBot: boolean
	isVerified: boolean
	color: string
	constructor(data: SBPUserData) {
		this.name = data.name
		this.avatar = data.avatar
		this.isBot = data.isBot
		this.isVerified = data.isVerified
		this.color = data.color
	}

	static async convert(user: UserResolvable, color?: string): Promise<SBPUser> {
		user = await container.client.users.fetch(user)

		if (!user) {
			return new SBPUser({
				name: 'Unknown User',
				avatar: 'https://discord.com/assets/f9bb9c4af2b9c32a2c5ee0014661546d.png',
				isBot: true,
				isVerified: false,
				color: '#FFFFFF',
			})
		}

		return new SBPUser({
			name: user.tag,
			avatar: user.displayAvatarURL(),
			isBot: user.bot,
			isVerified: user.flags?.toArray().includes('VERIFIED_BOT') ?? false,
			color: color ?? '#FFFFFF',
		})
	}
}

//<discord-invite name=\"discord.js - Imagine a bot\" icon=\"https://cdn.discordapp.com/icons/222078108977594368/881b843eb1d5c3bdb21928079d25549f.png\" url=\"https://discord.gg/djs\" online=\"16237\" members=\"59652\" verified=\"true\"></discord-invite>

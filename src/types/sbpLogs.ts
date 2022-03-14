import { container } from '@sapphire/pieces'
import { Embed, EmbedFieldData, GuildChannel, InviteResolvable, Message, UserResolvable } from 'discord.js'

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

	static async formatInvite(inv: InviteResolvable) {
		try {
			const invite = await container.client.fetchInvite(inv)

			return invite.guild
				? `<discord-invite name="${invite.guild?.name}" icon="${invite.guild.iconURL()}" url="${`https://discord.gg/${invite.code}`}" online="${invite.presenceCount}" members="${
						invite.memberCount
				  }" ${invite.guild.partnered ? 'partnered="true"' : invite.guild.verified ? 'verified="true"' : ''}></discord-invite>`
				: ''
		} catch (err) {
			return ''
		}
	}

	static getInviteCode(invite: InviteResolvable) {
		if (invite.startsWith('discord.gg')) {
			return `https://${invite}`
		} else if (invite.startsWith('https')) {
			return invite
		} else {
			return `https://discord.gg/${invite}`
		}
	}

	static async formatMessage(message: Message): Promise<SBPMessage> {
		let content = message.content ?? ''
		const invites: string[] = []

		if (message.mentions) {
			if (message.mentions.members) {
				for (const [, member] of message.mentions.members) {
					content = content.replace(member.toString(), SBPMessage.formatMention(member.user.tag))
				}
			}

			if (message.mentions.users) {
				for (const [, user] of message.mentions.users) {
					content = content.replace(user.toString(), SBPMessage.formatMention(user.tag))
				}
			}

			if (message.mentions.channels) {
				for (const [, channel] of message.mentions.channels) {
					if (channel instanceof GuildChannel) content = content.replace(channel.toString(), SBPMessage.formatMention(channel.name, 'channel'))
				}
			}

			if (message.mentions.roles) {
				for (const [, role] of message.mentions.roles) {
					content = content.replace(role.toString(), SBPMessage.formatMention(role.name, 'role', role.hexColor))
				}
			}
		}

		const inviteRegex = /((https?:\/\/)?(discord\.gg|discord\.com\/invite)\/)(?<code>([a-zA-Z0-9]{2,}))/g,
			emojiRegex = /(?:<:|<a:)\w{1,64}:(?<id>\d{17,18})>/g

		for (const invite of message.content.matchAll(inviteRegex)) {
			invites.push(await SBPMessage.formatInvite(invite[0]))
		}

		for (const emoji of message.content.matchAll(emojiRegex)) {
			if (!emoji.groups) continue

			const image = `https://cdn.discordapp.com/emojis/${emoji.groups.id}.png`

			content = content.replaceAll(emoji[0], `<img src="${image}" width="16" height="16">`)
		}

		content = content + invites.join(' ')

		return new SBPMessage({
			user: await SBPUser.convert(message.author),
			embeds: message.embeds.map((e) => SBPEmbed.convert(e)),
			text: content,
			id: message.id,
		})
	}

	static formatMention(name: string, type?: string, color?: string): string {
		return `<discord-mention${type ? ` type=${type}` : ''}${color ? ` color=${color}` : ''}>${name}</discord-mention>`
	}

	static async generateUrl(messages: SBPMessage[]): Promise<string> {
		const haste = await container.utils.haste(JSON.stringify(messages), true)

		return `https://skyblock-plus-logs.vercel.app/logs?url=${haste}`
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

	static convert(embed: Embed): SBPEmbed {
		return new SBPEmbed({
			title: embed.title ?? '',
			url: embed.url ?? '',
			description: embed.description ?? '',
			fields: embed.fields ?? [],
			footer: embed.data.footer?.text ?? '',
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
			isVerified: user.flags?.toArray().includes('VerifiedBot') ?? false,
			color: color ?? '#FFFFFF',
		})
	}
}

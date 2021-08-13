import { User } from 'discord.js'
import BotClient from '@extensions/BotClient'

export class FancyUser extends User {
	declare client: BotClient
	public declare timestamp: number

	public constructor(client: BotClient, options: any) {
		super(client, options)
		this.timestamp = Math.round(this.createdTimestamp / 1000)
	}

	isOwner() {
		return this.client.ownerID.includes(this.id)
	}

	getBadges() {
		const flags = this.flags?.toArray()
		if (flags === undefined) return []

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		return flags.map((f) => this.client.utils.flags.userFlags[f] ?? `\`${f}\``)
	}
}

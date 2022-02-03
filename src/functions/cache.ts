import { container } from '@sapphire/pieces'
import { Snowflake } from 'discord-api-types'
import { GuildDatabase } from '../types/database'

class GuildCache {
	public guilds: GuildDatabase[] = []

	public async fetchAll() {
		const guilds = await container.database.guilds.fetchAll()
		this.guilds = guilds
		return guilds
	}

	public get(id: Snowflake): GuildDatabase | undefined {
		return this.guilds.find((g) => g.guildID === id)
	}

	public check(id: Snowflake): boolean {
		return this.guilds.find((g) => g.guildID === id) ? true : false
	}

	public fetch = container.database.guilds.fetch

	public async updateOne(id: Snowflake) {
		const newGuild = (await container.database.guilds.fetchOne(id)) as GuildDatabase

		for (const g in this.guilds) {
			const guild = this.guilds[g]

			if (guild.guildID === id) {
				this.guilds[g] = newGuild
			}
		}
	}

	private async fetchOne(guildID: Snowflake) {
		const guildDB = this.guilds.find((g: GuildDatabase) => g.guildID == guildID)

		return guildDB
	}
}

export class Cache {
	guilds = new GuildCache()
}

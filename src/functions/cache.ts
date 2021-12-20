import { container } from '@sapphire/pieces'
import { Snowflake } from 'discord-api-types'
import { GuildDatabase } from '../types/database'

class GuildCache {
	public guilds: GuildDatabase[] = []

	public async fetchAll() {
		this.guilds = await container.database.guilds.fetchAll()
	}

	public get(id: Snowflake): GuildDatabase | undefined {
		return this.guilds.find((g) => g.guildID === id)
	}

    public check(id: Snowflake): boolean {
        return this.guilds.find((g) => g.guildID === id) ? true : false
    }

	public async fetch(id: Snowflake) {
		return await container.database.guilds.fetchOne(id)
	}

	public async updateOne(id: Snowflake) {
		const newGuild = (await container.database.guilds.fetchOne(id)) as GuildDatabase

		for (const g in this.guilds) {
			const guild = this.guilds[g]

			if (guild.guildID === id) {
				this.guilds[g] = newGuild
			}
		}
	}
}

export class Cache {
	guilds = new GuildCache()
}

import RainClient from '@extensions/RainClient'
import database from '@functions/database'
import { perms } from '@src/types/misc'
import { Role } from 'discord.js'
import { RawRoleData } from 'discord.js/typings/rawDataTypes'
import { RainGuild } from './Guild'

export class RainRole extends Role {
    declare client: RainClient
	public constructor(client: RainClient, options: RawRoleData, guild: RainGuild) {
		super(client, options, guild)
	}

	async getPerms(): Promise<perms | 'none'> {
		const roles = await (this.guild as RainGuild).database('guildSettings.staffRoles')

		for (const perm of Object.keys(roles)) {
			if (roles[perm] === this.id) return perm as perms
		}

		return 'none'
	}

    async setPerms(position: perms | null) {
		try {
			return await database.editGuild(this.guild.id, `guildSettings.staffRoles.${position}`, this.id)
		} catch (error) {
			this.client.utils.error(error, ' guild role editing')
			return false
		}
	}
}

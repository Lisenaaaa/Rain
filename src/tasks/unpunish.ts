import { RainGuild } from '@extensions/discord.js/Guild'
import { RainMember } from '@extensions/discord.js/GuildMember'
import { RainUser } from '@extensions/discord.js/User'
import { RainTask } from '@extensions/RainTasks'
import Utils from '@functions/utils'
import { databaseMember } from '@src/types/database'

export default class Unpunish extends RainTask {
	constructor() {
		super('unpunish', {
			delay: 60000,
			runOnStart: true,
		})
	}
	async exec() {
		for (const [id] of this.client.guilds.cache) {
			const guild = this.client.guilds.cache.get(id) as RainGuild
			const members = await guild.database('members')
			//const db = await guild.database('members')
			//if (db != undefined) members = db
			if (members.length === undefined) return
			members.forEach(async (member: databaseMember) => {
				/* unmute */
				if (member.muted.status === true && member.muted.expires != null && member.muted.expires <= Utils.now) {
					const person = (await guild.members.fetch(member.id)) as RainMember
					await person.unmute()
					await (person.user as RainUser).addModlogEntry(guild.id, 'UNMUTE', this.client.user?.id as string, { reason: 'Punishment expired.' })
					try {
						await person.user.send(`You have been automatically unmuted in **${guild.name}**`)
					} catch (err) {
						/*do nothing lol*/
					}
				}

				/* unban */
				if (member.banned.expires != null && member.banned.expires <= Utils.now) {
					const person = (await this.client.users.fetch(member.id)) as RainUser
					if (!await (await guild.bans.fetch()).has(person.id)) return
					await guild.bans.remove(person, 'Punishment expired.')
					await person.addModlogEntry(id, 'UNBAN', this.client.user?.id as string, { reason: 'Punishment expired.' })
					try {
						await person.send(`You have been automatically unbanned in **${guild.name}**`)
					} catch (err) {
						/*do nothing lol*/
					}
				}
			})
		}
	}
}
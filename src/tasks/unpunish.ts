import { RainGuild } from '@extensions/discord.js/Guild'
import { RainMember } from '@extensions/discord.js/GuildMember'
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
		await Utils.sleep(10)
		for (const [id] of this.client.guilds.cache) {
			const guild = this.client.guilds.cache.get(id) as RainGuild
			const members = await guild.database('members')
			members.forEach(async (member: databaseMember) => {
				if (member.muted.status === true && member.muted.expires != null && member.muted.expires <= Utils.currentTimestamp) {
					const person = await guild.members.fetch(member.id) as RainMember
					await person.unmute()
				}
			})
		}
	}
}

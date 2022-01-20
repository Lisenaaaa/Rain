import { PieceContext } from '@sapphire/framework'
import { RainTask } from '../structures/RainTaskPiece'
import { container } from '@sapphire/pieces'
import { GuildDatabase } from '../types/database'
import { GuildMember } from 'discord.js'

export class UnpunishTask extends RainTask {
	constructor(context: PieceContext) {
		super(context, {
			delay: 3 * 1000,
			runOnStart: true,
		})
	}

	async run() {
		for (const [id, guild] of container.client.guilds.cache) {
			if (!container.cache.guilds.check(id)) {
				await container.database.guilds.add(id)
				container.logger.debug(`Created database entry for ${guild.name} : ${id}`)
			}

			const { members, guildSettings } = container.cache.guilds.get(id) as GuildDatabase
			const { muteRole } = guildSettings

			for (const member of members) {
				const { muted } = member

				console.log(muted.status && muted.expires && muted.expires <= container.utils.now())
				/* unmute */

				if (muted.status && muted.expires && muted.expires <= container.utils.now()) {
					let person: GuildMember | undefined

					try {
						person = await guild.members.fetch(member.id)
					} catch (err) {
						/*do nothing*/
					}

					if (person) {
						if (!muteRole) {
							return await container.utils.error(new Error('No mute role set.'), {
								type: 'unmuting a member',
								data: {},
							})
						}

						container.logger.debug(`unmuting ${person.id} on ${id}`)
						await container.members.unmute(person)
						await container.users.addModlogEntry(person.user, id, 'UNMUTE', container.client.user?.id as string, { reason: 'Automatically unmuted.' })

						try {
							await person.send(`You have been automatically unmuted in **${guild.name}**`)
						} catch (err) {
							/* do nothing */
						}
					}
				}
			}
		}
	}
}

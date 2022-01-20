import { PieceContext } from '@sapphire/framework'
import { RainTask } from '../structures/RainTaskPiece'
import { container } from '@sapphire/pieces'
// import { GuildDatabase } from '../types/database'

export class UnpunishTask extends RainTask {
	constructor(context: PieceContext) {
		super(context, {
			delay: 3 * 1000,
		})
	}

	async run() {
		for (const [id, guild] of container.client.guilds.cache) {
			if (!container.cache.guilds.check(id)) {
				await container.database.guilds.add(id)
                container.logger.debug(`Created database entry for ${guild.name} : ${id}`)
			}

            // const database = container.cache.guilds.get(id) as GuildDatabase

            // console.log(database)
		}
	}
}

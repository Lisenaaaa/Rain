// import { RainListener } from '@extensions/RainListener'
// import database from '@functions/database'
// import { Guild, TextChannel } from 'discord.js'

// export default class guildJoinDBCreateListener extends RainListener {
// 	constructor() {
// 		super('guildJoinDBCreate', {
// 			emitter: 'client',
// 			event: 'guildCreate',
// 		})
// 	}

// 	async exec(guild: Guild) {
// 		let dbconsole: string
// 		database.add(guild.id).then((e) => {
// 			if (e) {
// 				if (e.result.ok == 1) {
// 					dbconsole = 'Database entry successfully added.'
// 				}
// 			} else {
// 				dbconsole = 'Guild already in DB, so entry was not created.'
// 			}

// 			const logChannel = this.client.channels.cache.get('839215645715595316') as TextChannel
// 			logChannel.send(`Joined ${guild.name}\n${dbconsole}`)
// 		})
// 	}
// }

// import { BotListener } from '@extensions/BotListener'
// import database from '@functions/database'
// import utils from '@functions/utils'
// import { Guild, TextChannel } from 'discord.js'

// class guildJoinDBCreate extends BotListener {
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

// module.exports = guildJoinDBCreate

import { container } from '@sapphire/framework'
import { Sequelize } from 'sequelize'
import Config from '../config/config'
import { CommandDatabase } from './databases/commands'
import { GuildDatabase } from './databases/guild'
import { GuildCommandDatabase } from './databases/guildCommands'
import { MemberDatabase } from './databases/members'
import { ModlogDatabase } from './databases/modlogs'
const { database } = new Config()

export const sequelize = new Sequelize(`postgres://${database.pguser}:${database.pguserpassword}@${database.pghost}:${database.pgport}/${database.pgdbid}`, {
	logging: false,
})

export class Database {
	static async connect() {
		try {
			await sequelize.authenticate()
			container.logger.info('Connected to the database.')
		} catch (error) {
			console.error('Unable to connect to the database:', error)
		}
	}

	static async init() {
		GuildDatabase.initModel()
		ModlogDatabase.initModel()
		MemberDatabase.initModel()
		GuildCommandDatabase.initModel()
		CommandDatabase.initModel()

		await sequelize.sync({ alter: true })
	}

	async run() {
		// add //
		// await GuildDatabase.create({ id: 'id' })
		// fetch //
		// console.log(await GuildDatabase.findByPk('id')) // the database, or `null` if it isn't there
		// fetch all //
		// await GuildDatabase.findAll() // remove the map if you want to, say, run something on all of them
		// edit //
		// await GuildDatabase.update({ welcomeMessage: 'hi {user} you suck xfbvndskjhfgbndsfkjh,gbndskjjgbfhn' }, { where: { id: 'id' } })
		// delete //
		// await GuildDatabase.destroy({ where: { id: 'id' } })
	}
}

// // eslint-disable-next-line @typescript-eslint/no-extra-semi
// ;(async () => {
// 	await Database.connect()
// 	await Database.init()
// })()

/*

This is me trying to rewrite the database to not just use JSON formatting for everything.

*/

// import { DataTypes, Model, Sequelize } from 'sequelize'
// import { container } from '@sapphire/framework'
// import Config from '../config/config'
// const config = new Config()


// const sequelize = new Sequelize('testingdb', config.database.pguser, config.database.pguserpassword, {
// 	host: config.database.pghost,
// 	dialect: 'postgres',
// 	logging: false,
// })

// export class TestGuildDatabase extends Model {}

// export async function initDB() {
// 	try {
// 		await sequelize.authenticate()
// 		container.logger.info('Successfully connected to the TESTING database.')
// 	} catch (error) {
// 		container.logger.fatal('Unable to connect to the TESTING database:', error)
// 	}

// 	await sequelize.sync()

// 	TestGuildDatabase.init(
// 		{
// 			guildID: DataTypes.STRING,
// 			guildSettings: { staffRoles: DataTypes.ENUM('owner', 'admin', 'srMod', 'moderator', 'helper', 'trialHelper') },
// 		},
// 		{ sequelize, modelName: 'guild' }
// 	)
// }

// const database = {
// 	async fetchAll() {
// 		const entries = []
// 		const channels = await mmChannel.findAll()
// 		channels.forEach((channel) => {
// 			entries.push({ channelID: channel.dataValues.channelID, userID: channel.dataValues.userID })
// 		})

// 		return entries
// 	},

// 	async getUserChannel(userID) {
// 		try {
// 			return client.guilds.cache.get(config.guild).channels.cache.get((await this.fetchAll()).find((c) => c.userID === userID).channelID)
// 		} catch (err) {
// 			return undefined
// 		}
// 	},

// 	async getChannelUser(channelID) {
// 		try {
// 			return await client.users.fetch((await this.fetchAll()).find((c) => c.channelID === channelID).userID)
// 		} catch (err) {
// 			return undefined
// 		}
// 	},

// 	async addChannel(channelID, userID) {
// 		return await mmChannel.create({ channelID, userID })
// 	},

// 	async clearAllChannels(userID) {
// 		await mmChannel.destroy({
// 			where: {
// 				userID
// 			}
// 		})
// 	}
// }

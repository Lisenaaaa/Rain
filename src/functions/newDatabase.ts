/*

This is me trying to rewrite the database to not just use JSON formatting for everything.

*/

// import { DataTypes, Model, Sequelize } from 'sequelize'
// import { container } from '@sapphire/framework'
// import Config from '../config/config'
// const config = new Config()

// // type GuildDatabase = {
// // 	guildID: string
// // 	guildSettings: {
// // 		muteRole: string | undefined
// // 		welcomeChannel: string | undefined
// // 		welcomeMessage: string | undefined
// // 		loggingChannels: {
// // 			message: string | undefined
// // 			member: string | undefined
// // 			moderation: string | undefined
// // 			action: string | undefined
// // 		}
// // 		staffRoles: {
// // 			owner: string | undefined
// // 			admin: string | undefined
// // 			srMod: string | undefined
// // 			moderator: string | undefined
// // 			helper: string | undefined
// // 			trialHelper: string | undefined
// // 		}
// // 		lockedChannels: {
// // 			owner: string[]
// // 			admin: string[]
// // 			srMod: string[]
// // 			moderator: string[]
// // 			helper: string[]
// // 			trialHelper: string[]
// // 		}
// // 	}
// // 	members: {
// // 		id: string
// // 		modlogs: {
// // 			id: string
// // 			type: 'BAN' | 'UNBAN' | 'KICK' | 'MUTE' | 'UNMUTE' | 'WARN' | 'UNKNOWN'
// // 			modID: string
// // 			reason: string
// // 			duration?: string
// // 			createdTimestamp: number
// // 			evidence?: string
// // 		}[]
// // 		muted: { status: boolean; expires: number | undefined }
// // 		banned: { expires: number | undefined }
// // 	}[]
// // 	commandSettings: {
// // 		id: string
// // 		enabled: boolean
// // 		requiredPerms: 'owner' | 'admin' | 'srMod' | 'moderator' | 'helper' | 'trialHelper' | 'none'
// // 		lockedChannels: string[]
// // 		data?: unknown
// // 	}[]
// // 	features: { id: string; enabled: boolean }[]
// // }

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
// 			staffRoles: DataTypes.ENUM('owner', 'admin', 'srMod', 'moderator', 'helper', 'trialHelper'),
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

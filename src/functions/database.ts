import config from '@src/config/config'
import chalk from 'chalk'
import { Snowflake } from 'discord.js'

import { QueryOptions, QueryOptionsWithType, QueryTypes, Sequelize } from 'sequelize'
import client from '..'
const pg = new Sequelize(config.database.pgdbid, config.database.pguser, config.database.pguserpassword, {
	host: config.database.pghost,
	dialect: 'postgres',
	logging: false,
})

const thingy = async () => {
	try {
		await pg.authenticate()
		console.log(chalk.blue('Succesfully connected to the database.'))
	} catch (err) {
		console.log(chalk.red(err.stack))
	}
}
thingy()

async function rawDbRequest(string: string, options: QueryOptions | QueryOptionsWithType<QueryTypes.RAW> = {}) {
	return await pg.query(string, options)
}

function defaultDBSchema(messageGuildID: string) {
	const defaultDBSchema = {
		guildID: messageGuildID,
		guildSettings: {
			prefix: ['-'],
			welcomeChannel: 'null',
			welcomeMessage: 'null',
			loggingChannels: {
				messageLogs: 'null',
				memberLogs: 'null',
				moderationLogs: 'null',
			},
			staffRoles: {
				owner: 'null',
				admin: 'null',
				srMod: 'null',
				moderator: 'null',
				helper: 'null',
				trialHelper: 'null',
			},
			lockedChannels: [
				{
					id: 'owner',
					channels: [],
				},
				{
					id: 'admin',
					channels: [],
				},
				{
					id: 'srMod',
					channels: [],
				},
				{
					id: 'moderator',
					channels: [],
				},
				{
					id: 'helper',
					channels: [],
				},
				{
					id: 'trialHelper',
					channels: [],
				},
			],
		},
		commandSettings: [],
		tags: [],
	}
	return defaultDBSchema
}

function commandDBSFormat(commandID: string) {
	const commandDBSchema = {
		id: commandID,
		enabled: true,
	}
	return commandDBSchema
}
function commandDBsFormatDisabled(commandID: string) {
	const commandDBSchema = {
		id: commandID,
		enabled: false,
	}
	return commandDBSchema
}

function commandInGuildSettingsFormat(commandID: string) {
	const commandDBSchema = {
		id: commandID,
		enabled: true,
		allowedRoles: 'null',
	}
	return commandDBSchema
}

function userDBSchema(userID: string) {
	return {
		id: userID,
		blocked: false,
		premiumTokens: 0,
	}
}

async function readGuild(messageGuildID: string) {
	return (await getEntireGuildsDB()).find(d => d.guildID == messageGuildID)
}

async function getEntireGuildsDB() {
	const guilddb = await rawDbRequest('SELECT * from guilds;')
	const alldbs = []
	guilddb[0].forEach((db: any) => {
		alldbs.push(db.data)
	})

	return alldbs
}

async function editSpecificGuildInDB(guildID: Snowflake, query: string, newValue: any) {
	try {
		const guildDB = (await getEntireGuildsDB()).find((d) => d.guildID == guildID)

		const queryArray = query.split('.')

		let dbObject = guildDB

		const lastQueryArray = queryArray.pop()

		queryArray.forEach((query) => {
			dbObject = dbObject[query]
		})

		dbObject[lastQueryArray] = newValue

		await rawDbRequest('UPDATE guilds SET data = $guildDB WHERE data->>"guildID" = $guildID;', { bind: { guildDB: guildDB, guildID: guildID } })

		return true
	}
	catch(err) {
		client.utils.error(err, ' database editing')
		return false
	}
}

export default {
	defaultDBSchema,
	getEntireGuildsDB,
	rawDbRequest,
	readGuild,
	editSpecificGuildInDB
}

import config from '@src/config/config'
import { GuildDatabase, GuildDatabaseConstructor, UserDatabaseConstructor } from '@src/types/database'
import chalk from 'chalk'
import { Snowflake } from 'discord.js'
import { QueryOptions, QueryOptionsWithType, QueryTypes, Sequelize } from 'sequelize'
import client from '..'

const pg = new Sequelize(config.database.pgdbid, config.database.pguser, config.database.pguserpassword, {
	host: config.database.pghost,
	dialect: 'postgres',
	logging: false,
})

const initializeDatabase = async () => {
	try {
		await pg.authenticate()
		console.log(chalk.blue('Succesfully connected to the database.'))
	} catch (err) {
		console.log(chalk.red(err.stack))
		process.exit()
	}
}
initializeDatabase()

async function rawDbRequest(string: string, options: QueryOptions | QueryOptionsWithType<QueryTypes.RAW> = {}) {
	return await pg.query(string, options)
}

function defaultDBSchema(guildID: Snowflake) {
	return new GuildDatabaseConstructor({
		guildID: guildID,
		guildSettings: {
			muteRole: null,
			welcomeChannel: 'null',
			welcomeMessage: 'null',
			loggingChannels: { message: null, member: null, moderation: null, action: null },
			staffRoles: { owner: null, admin: null, srMod: null, moderator: null, helper: null, trialHelper: null },
			lockedChannels: { owner: [], admin: [], srMod: [], moderator: [], helper: [], trialHelper: [] },
		},
		members: [],
		commandSettings: [],
		features: [],
	})
}

async function readGuild(guildID: Snowflake) {
	const guilds = await getEntireGuildsDB()
	const guildDB = guilds.find((g: GuildDatabase) => g.guildID == guildID)

	return guildDB
}

async function getEntireGuildsDB() {
	const guilddb = await rawDbRequest('SELECT * from guilds;')
	const alldbs: GuildDatabase[] = []

	/* typescript is stupid and i want eslint to not be yell */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	guilddb[0].forEach((db: any) => {
		alldbs.push(db.data)
	})

	return alldbs
}

async function editGuild(guildID: Snowflake, query: string, newValue: unknown) {
	if (query === 'guildID') return false
	try {
		const guildDB = (await getEntireGuildsDB()).find((d: GuildDatabase) => d.guildID == guildID) as GuildDatabase

		const queryArray = query.split('.')

		let dbObject: GuildDatabase = guildDB

		const finalQuery = queryArray.pop()

		queryArray.forEach((query) => {
			//@ts-ignore ok typescript
			dbObject = dbObject?.[query as keyof typeof dbObject]
		})

		//@ts-ignore ok typescript
		dbObject[finalQuery as keyof typeof dbObject] = newValue

		await rawDbRequest("UPDATE guilds SET data = $1 WHERE data->>'guildID' = $2;", { bind: [guildDB, guildID] })

		return true
	} catch (err) {
		client.utils.error(err, ' database editing')
		return false
	}
}

async function addGuild(guildID: Snowflake) {
	try {
		const schema = JSON.stringify(defaultDBSchema(guildID))
		const string = `INSERT INTO guilds(data) VALUES ($schema);`
		await rawDbRequest(string, { bind: { schema: schema } })
		return true
	} catch (err) {
		await client.utils.error(err.stack, ' database adding')
		return false
	}
}

async function deleteGuild(guildID: Snowflake) {
	try {
		await rawDbRequest("DELETE FROM guilds WHERE data->>'guildID' = $1;", { bind: [guildID] })
		return true
	} catch (err) {
		await client.utils.error(err.stack, ' database guild removal')
		return false
	}
}

async function addUser(userID: Snowflake) {
	try {
		const schema = JSON.stringify(new UserDatabaseConstructor({userID: userID, badges: [], superuser: false, blacklisted: false}))
		const string = `INSERT INTO users(data) VALUES ($schema);`
		await rawDbRequest(string, { bind: { schema: schema } })
		return true
	} catch (err) {
		await client.utils.error(err.stack, ' database adding')
		return false
	}
}

async function getEntireUsersDB() {
	const userdb = await rawDbRequest('SELECT * from users;')
	const alldbs: {userID: Snowflake, badges: string[], superuser: boolean}[] = []

	/* typescript is stupid and i want eslint to not be yell */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	userdb[0].forEach((db: any) => {
		alldbs.push(db.data)
	})

	return alldbs
}

async function getUser(userID: Snowflake) {
	const usersDB = await getEntireUsersDB()
	return usersDB.find(user => user.userID === userID)
}

async function editUser(userID: Snowflake, query: 'badges'|'superuser', newValue: unknown) {
	try {
		const userDB = (await getUser(userID)) as {userID: Snowflake, badges: string[], superuser: boolean}

		const queryArray = query.split('.')

		let dbObject: {userID: Snowflake, badges: string[], superuser: boolean} = userDB

		const finalQuery = queryArray.pop()

		queryArray.forEach((query) => {
			//@ts-ignore ok typescript
			dbObject = dbObject?.[query as keyof typeof dbObject]
		})

		//@ts-ignore ok typescript
		dbObject[finalQuery as keyof typeof dbObject] = newValue

		await rawDbRequest("UPDATE users SET data = $1 WHERE data->>'userID' = $2;", { bind: [userDB, userID] })

		return true
	} catch (err) {
		client.utils.error(err, ' database editing')
		return false
	}
}

async function addCommand(commandID: Snowflake) {
	try {
		const schema = JSON.stringify({commandID: commandID, enabled: true})
		const string = `INSERT INTO commands(data) VALUES ($schema);`
		await rawDbRequest(string, { bind: { schema: schema } })
		return true
	} catch (err) {
		await client.utils.error(err.stack, ' database adding')
		return false
	}
}

async function getEntireCommandsDB() {
	const commandsdb = await rawDbRequest('SELECT * from commands;')
	const alldbs: {commandID: string, enabled: boolean}[] = []

	/* typescript is stupid and i want eslint to not be yell */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	commandsdb[0].forEach((db: any) => {
		alldbs.push(db.data)
	})

	return alldbs
}

async function getCommand(commandID: string) {
	const commandsDB = await getEntireCommandsDB()
	return commandsDB.find(cmd => cmd.commandID === commandID)
}

async function editCommand(commandID: string, query: 'enabled', newValue: unknown) {
	try {
		const commandsDB = (await getCommand(commandID)) as {commandID: string, enabled: true}

		const queryArray = query.split('.')

		let dbObject: {commandID: string, enabled: true} = commandsDB

		const finalQuery = queryArray.pop()

		queryArray.forEach((query) => {
			//@ts-ignore ok typescript
			dbObject = dbObject?.[query as keyof typeof dbObject]
		})

		//@ts-ignore ok typescript
		dbObject[finalQuery as keyof typeof dbObject] = newValue

		await rawDbRequest("UPDATE commands SET data = $1 WHERE data->>'commandID' = $2;", { bind: [commandsDB, commandID] })

		return true
	} catch (err) {
		client.utils.error(err, ' database editing')
		return false
	}
}

export default {
	defaultDBSchema,
	getEntireGuildsDB,
	rawDbRequest,
	readGuild,
	editGuild,
	addGuild,
	deleteGuild,

	addUser,
	getUser,
	getEntireUsersDB,
	editUser,

	addCommand,
	getCommand,
	getEntireCommandsDB,
	editCommand,
}

import { container } from '@sapphire/pieces'
import Config from '../config/config'
import { GuildDatabase, GuildDatabaseConstructor, UserDatabaseConstructor } from '../types/database'
import { Snowflake } from 'discord.js'
import { QueryOptions, QueryOptionsWithType, QueryTypes, Sequelize } from 'sequelize'

const config = new Config()
const pg = new Sequelize(config.database.pgdbid, config.database.pguser, config.database.pguserpassword, {
	host: config.database.pghost,
	dialect: 'postgres',
	logging: false,
})

function defaultDBSchema(guildID: Snowflake) {
	return new GuildDatabaseConstructor({
		guildID: guildID,
		guildSettings: {
			muteRole: null,
			welcomeChannel: 'null',
			welcomeMessage: 'null',
			loggingChannels: { message: null, member: null, moderation: null, action: null },
			staffRoles: {
				owner: null,
				admin: null,
				srMod: null,
				moderator: null,
				helper: null,
				trialHelper: null,
			},
			lockedChannels: {
				owner: [],
				admin: [],
				srMod: [],
				moderator: [],
				helper: [],
				trialHelper: [],
			},
		},
		members: [],
		commandSettings: [],
		features: [],
	})
}

async function rawDbRequest(string: string, options: QueryOptions | QueryOptionsWithType<QueryTypes.RAW> = {}) {
	return await pg.query(string, options)
}

export default class Database {
	query = rawDbRequest
	async initDB() {
		try {
			await pg.authenticate()
			container.logger.info('Succesfully connected to the database.')
		} catch (err) {
			container.logger.error(err.stack)
			process.exit()
		}
	}

	guilds = new DatabaseGuilds()
	users = new DatabaseUsers()
	commands = new DatabaseCommands()
}

class DatabaseGuilds {
	public async fetch(id?: Snowflake) {
		if (id) {
			const guild = await this.fetchOne(id)
			await container.cache.guilds.updateOne(id)
			return guild
		} else {
			const guilds = await this.fetchAll()
			container.cache.guilds.guilds = guilds

			return guilds
		}
	}

	public async fetchOne(guildID: Snowflake) {
		const guilds = await this.fetchAll()
		const guildDB = guilds.find((g: GuildDatabase) => g.guildID == guildID)

		return guildDB
	}

	public async fetchAll() {
		try {
			const guilddb = await rawDbRequest('SELECT * from guilds;')
			const alldbs: GuildDatabase[] = []

			/* typescript is stupid and i want eslint to not be yell */
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			guilddb[0].forEach((db: any) => {
				alldbs.push(db.data)
			})

			return alldbs
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Failed to fetch guilds.' },
			})
			return []
		}
	}

	public async edit(guildID: Snowflake, query: string, newValue: unknown) {
		if (query === 'guildID') return false
		try {
			const guildDB = (await this.fetchAll()).find((d: GuildDatabase) => d.guildID == guildID) as GuildDatabase
			const queryArray = query.split('.')
			let dbObject: GuildDatabase = guildDB
			const finalQuery = queryArray.pop()

			queryArray.forEach((query) => {
				//@ts-ignore ok typescript
				dbObject = dbObject?.[query as keyof typeof dbObject]
			})

			//@ts-ignore ok typescript
			dbObject[finalQuery] = newValue

			await rawDbRequest("UPDATE guilds SET data = $1 WHERE data->>'guildID' = $2;", {
				bind: [guildDB, guildID],
			})

			await container.cache.guilds.updateOne(guildID)

			return true
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Failed to edit a guild.' },
			})
			return false
		}
	}

	public async add(guildID: Snowflake) {
		if (!guildID) throw new Error('I cannot create a guild database entry without an ID')
		try {
			const schema = JSON.stringify(defaultDBSchema(guildID))
			const string = `INSERT INTO guilds(data) VALUES ($schema);`
			await rawDbRequest(string, { bind: { schema: schema } })
			await container.cache.guilds.fetchAll()
			return true
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Failed to create a guild.' },
			})
			return false
		}
	}

	public async delete(guildID: Snowflake) {
		try {
			await rawDbRequest("DELETE FROM guilds WHERE data->>'guildID' = $1;", {
				bind: [guildID],
			})
			return true
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Failed to delete a guild.' },
			})
			return false
		}
	}
}

class DatabaseUsers {
	public async add(userID: Snowflake) {
		if (!userID) throw new Error('I cannot create a user database entry without an ID')
		try {
			const schema = JSON.stringify(
				new UserDatabaseConstructor({
					userID: userID,
					badges: [],
					superuser: false,
					blacklisted: false,
				})
			)
			const string = `INSERT INTO users(data) VALUES ($schema);`
			await rawDbRequest(string, { bind: { schema: schema } })
			return true
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Failed to create a user.' },
			})
			return false
		}
	}

	public async fetchAll() {
		try {
			const userdb = await rawDbRequest('SELECT * from users;')
			const alldbs: { userID: Snowflake; badges: string[]; superuser: boolean }[] = []

			/* typescript is stupid and i want eslint to not be yell */
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			userdb[0].forEach((db: any) => {
				alldbs.push(db.data)
			})

			return alldbs
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Failed to fetch users.' },
			})
			return []
		}
	}

	public async fetchOne(userID: Snowflake) {
		const usersDB = await this.fetchAll()
		return usersDB.find((user) => user.userID === userID)
	}

	public async edit(userID: Snowflake, query: 'badges' | 'superuser', newValue: unknown) {
		try {
			const userDB = (await this.fetchOne(userID)) as {
				userID: Snowflake
				badges: string[]
				superuser: boolean
			}

			const queryArray = query.split('.')

			let dbObject: { userID: Snowflake; badges: string[]; superuser: boolean } = userDB

			const finalQuery = queryArray.pop()

			queryArray.forEach((query) => {
				//@ts-ignore ok typescript
				dbObject = dbObject?.[query as keyof typeof dbObject]
			})

			//@ts-ignore ok typescript
			dbObject[finalQuery as keyof typeof dbObject] = newValue

			await rawDbRequest("UPDATE users SET data = $1 WHERE data->>'userID' = $2;", {
				bind: [userDB, userID],
			})

			return true
		} catch (err) {
			await container.utils.error(err, {
				type: 'Database',
				data: { note: 'Failed to edit a user.' },
			})
			return false
		}
	}
}

class DatabaseCommands {
	public async add(commandID: Snowflake) {
		if (!commandID) throw new Error('I cannot create a command database entry without an ID')
		try {
			const schema = JSON.stringify({ commandID: commandID, enabled: true })
			const string = `INSERT INTO commands(data) VALUES ($schema);`
			await rawDbRequest(string, { bind: { schema: schema } })
			return true
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Failed to create a command.' },
			})
			return false
		}
	}

	public async fetchAll() {
		try {
			const commandsdb = await rawDbRequest('SELECT * from commands;')
			const alldbs: { commandID: string; enabled: boolean }[] = []

			/* typescript is stupid and i want eslint to not be yell */
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			commandsdb[0].forEach((db: any) => {
				alldbs.push(db.data)
			})

			return alldbs
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Failed to fetch commands.' },
			})
			return []
		}
	}

	public async fetchOne(commandID: string) {
		const commandsDB = await this.fetchAll()
		return commandsDB.find((cmd) => cmd.commandID === commandID)
	}

	public async edit(commandID: string, query: 'enabled', newValue: unknown) {
		try {
			const commandsDB = (await this.fetchOne(commandID)) as {
				commandID: string
				enabled: true
			}

			const queryArray = query.split('.')

			let dbObject: { commandID: string; enabled: true } = commandsDB

			const finalQuery = queryArray.pop()

			queryArray.forEach((query) => {
				//@ts-ignore ok typescript
				dbObject = dbObject?.[query as keyof typeof dbObject]
			})

			//@ts-ignore ok typescript
			dbObject[finalQuery as keyof typeof dbObject] = newValue

			await rawDbRequest("UPDATE commands SET data = $1 WHERE data->>'commandID' = $2;", {
				bind: [commandsDB, commandID],
			})

			return true
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Failed to edit a command.' },
			})
			return false
		}
	}
}

import chalk from 'chalk'
import { Command } from 'discord-akairo'
import commandManager from './commandManager'

require('dotenv').config()
const { MongoClient } = require('mongodb')
const uri = process.env.mongodb

const mongoclient = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

let db: any
async function run() {
	try {
		await mongoclient.connect().then(() => {
			db = mongoclient.db('bot')
		})

		console.log(chalk.blue('Connected to MongoDB.'))
	} catch (err) {
		//catch(err){/*client*/.utils.error(err)}
		console.log(err.stack)
	}
}
run().catch((error) => {
	console.error(chalk.red(`Failed to connect to MongoDB\n${error.stack}`))
	return process.exit()
})

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
	const guildDB = await db.collection('guildsv2').find({ guildID: messageGuildID }).toArray()

	return guildDB[0]
}

async function getEntireGuildsDB() {
	return await db.collection('guildsv2').find().toArray()
}

async function add(messageGuildID: string) {
	const allDB = await getEntireGuildsDB()

	for (const e of allDB) {
		if (e.guildID == messageGuildID) {
			return
		}
	}

	return await db.collection('guildsv2').insertOne(defaultDBSchema(messageGuildID))
}

//THIS WILL PROBABLY BREAK EVERYTHING IF USED, SO DON'T FUCKING USE IT
async function addGuildWithoutCheck(messageGuildID: string) {
	return await db.collection('guildsv2').insertOne(defaultDBSchema(messageGuildID))
}

async function addTag(messageGuildID: string, tagName: string, tagResponse: string) {
	const query = { guildID: messageGuildID }
	const update = { $push: { tags: { name: tagName, value: tagResponse } } }

	try {
		await db.collection('guildsv2').updateOne(query, update)
		return 'success'
	} catch (error) {
		//client.error(error) }
		console.log(error)
	}
}

async function editTag(messageGuildID: string, tagName: string, newTagResponse: string) {
	const query = { guildID: messageGuildID, tags: { $elemMatch: { name: tagName } } }
	const update = { $set: { 'tags.$.value': newTagResponse } }

	return await db.collection('guildsv2').updateOne(query, update)
}

async function deleteTag(messageGuildID: string, tagName: string) {
	const query = { guildID: messageGuildID }
	const update = { $pull: { tags: { name: tagName } } }

	return await db.collection('guildsv2').updateOne(query, update)
}

async function guildSettings(messageGuildID: string) {
	const data = await readGuild(messageGuildID)
	return data[0].guildSettings
}

async function editRolePermissions(messageGuildID: string, roleToEdit: string, newRoleID: string) {
	const query = { guildID: messageGuildID }
	const object = { ['guildSettings.staffRoles.' + roleToEdit]: newRoleID }
	const update = { $set: object }

	return await db.collection('guildsv2').updateOne(query, update)
}

async function toggleCommand(messageGuildID: string, commandToToggle: string) {
	const query = { guildID: messageGuildID }
	const allGuildCommands = (await readGuild(messageGuildID))[0].commandSettings
	const allCommands = commandManager.getAllCommandIDs()
	const cmd = allGuildCommands.find((cmd: Command) => cmd.id == commandToToggle)

	if (cmd == undefined) {
		if (allCommands.includes(commandToToggle)) {
			//return 'command is in bot but not guild db'
			await addCommandToGuildDB(messageGuildID, commandToToggle)
		} else {
			return 'not a command'
		}
	}

	let object

	if (allGuildCommands.find((cmd: Command) => cmd.id == commandToToggle).enabled == true) {
		object = { ['commandSettings.' + commandToToggle]: false }
	} else {
		object = { ['commandSettings.' + commandToToggle]: true }
	}

	const update = { $set: object }

	return await db.collection('guildsv2').updateOne(query, update)
}

async function addCommandToGuildDB(guildID: string, commandID: string) {
	const query = { guildID: guildID }
	const update = { $push: { commandSettings: commandInGuildSettingsFormat(commandID) } }

	return await db.collection('guildsv2').updateOne(query, update)
}

async function checkIfCommandInGuildDB(guildID: string, commandID: string) {
	let found = false
	return readGuild(guildID).then(async (db) => {
		db[0].commandSettings.forEach((cmd: Command) => {
			if (cmd.id == commandID) {
				return (found = true)
			}
		})

		if (found == false) {
			await addCommandToGuildDB(guildID, commandID)
			found = true
		}
		return found
	})
}

/* GLOBAL THINGS */
async function addCommandToGlobalDB(commandID: string) {
	return await db.collection('commands').insertOne(commandDBSFormat(commandID))
}

async function readCommandGlobal() {
	return await db.collection('commands').find({}).toArray()
}

async function readSpecificCommandGlobal(commandID: string) {
	return await db.collection('commands').find({ id: commandID }).toArray()
}

async function deleteCommandFromGlobalDB(commandID: string) {
	await db.collection('commands').deleteOne(commandDBsFormatDisabled(commandID))
	await db.collection('commands').deleteOne(commandDBSFormat(commandID))
}

async function checkCommandEnabledGlobal(commandID: string) {
	const fuckYouTypescript = (await readSpecificCommandGlobal(commandID))[0].enabled
	return fuckYouTypescript
}

/* USER THINGS */
async function userRead(userID: string) {
	return await db.collection('user').find({ ID: userID }).toArray()
}

async function getEntireUserDB() {
	return await db.collection('guildsv2').find().toArray()
}

async function userAdd(userID: string) {
	for (const e of await getEntireUserDB()) {
		if (e.userID == userID) {
			return
		}
	}

	return await db.collection('user').insertOne(userDBSchema(userID))
}

export default {
	readGuild,
	add,
	addTag,
	editTag,
	deleteTag,
	guildSettings,
	addGuildWithoutCheck,
	addCommandToGuildDB,
	editRolePermissions,
	checkIfCommandInGuildDB,
	toggleCommand,

	//GLOBAL THINGS//
	addCommandToGlobalDB,
	deleteCommandFromGlobalDB,
	readCommandGlobal,
	readSpecificCommandGlobal,
	checkCommandEnabledGlobal,

	//USER THINGS//
	userRead,
	userAdd,
	getEntireUserDB,
}

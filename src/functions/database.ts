import { BotClient } from "@extensions/BotClient";
import chalk from "chalk";
import commandManager from "./commandManager";


require('dotenv').config()
const { MongoClient } = require('mongodb');
const uri = process.env.mongodb

const mongoclient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let db
async function run() {
    try {
        await mongoclient.connect().then(() => {
            db = mongoclient.db('bot')
        })

        console.log(chalk.blue('Connected to MongoDB.'))

    } finally { }
}
run().catch(console.dir)

function defaultDBSchema(messageGuildID) {
    const defaultDBSchema = {
        guildID: messageGuildID,
        guildSettings: {
            prefix: ['-'],
            welcomeChannel: 'null',
            welcomeMessage: 'null',
            loggingChannels: {
                messageLogs: 'null',
                memberLogs: 'null',
                moderationLogs: 'null'
            },
            staffRoles: {
                owner: 'null',
                admin: 'null',
                srMod: 'null',
                moderator: 'null',
                helper: 'null',
                trialHelper: 'null'
            },
            lockedChannels: [
                {
                    id: 'owner',
                    channels: []
                },
                {
                    id: 'admin',
                    channels: []
                },
                {
                    id: 'srMod',
                    channels: []
                },
                {
                    id: 'moderator',
                    channels: []
                },
                {
                    id: 'helper',
                    channels: []
                },
                {
                    id: 'trialHelper',
                    channels: []
                },
            ]
        },
        commandSettings: [],
        tags: []
    }
    return defaultDBSchema
}

function commandDBSFormat(commandID: string) {
    const commandDBSchema = {
        id: commandID,
        enabled: true
    }
    return commandDBSchema
}
function commandDBsFormatDisabled(commandID: string) {
    const commandDBSchema = {
        id: commandID,
        enabled: false
    }
    return commandDBSchema
}

function commandInGuildSettingsFormat(commandID: string) {
    const commandDBSchema = {
        id: commandID,
        enabled: true,
        allowedRoles: 'null'
    }
    return commandDBSchema
}

function userDBSchema(userID: string) {
    return {
        id: userID,
        blocked: false,
        premiumTokens: 0
    }
}

async function readGuild(messageGuildID: string) {
    return await db.collection('guildsv2')
        .find({ guildID: messageGuildID })
        .toArray()
}

async function getEntireGuildsDB() {
    return await db.collection('guildsv2').find().toArray()
}

async function add(messageGuildID: string) {
    let allDB = await getEntireGuildsDB()

    for (let e of allDB) {
        if (e.guildID == messageGuildID) {
            return
        }
    }

    return await db.collection('guildsv2')
        .insertOne(defaultDBSchema(messageGuildID))
}

//THIS WILL PROBABLY BREAK EVERYTHING IF USED, SO DON'T FUCKING USE IT
async function addGuildWithoutCheck(messageGuildID: string) {
    return await db.collection('guildsv2')
        .insertOne(defaultDBSchema(messageGuildID))
}

async function addTag(messageGuildID: string, tagName: string, tagResponse: string) {
    let query = { guildID: messageGuildID }
    let update = { $push: { tags: { name: tagName, value: tagResponse } } }

    return await db.collection('guildsv2')
        .updateOne(query, update)
}

async function editTag(messageGuildID: string, tagName: string, newTagResponse: string) {
    let query = { guildID: messageGuildID, tags: { $elemMatch: { name: tagName } } }
    let update = { $set: { 'tags.$.value': newTagResponse } }

    return await db.collection('guildsv2')
        .updateOne(query, update)
}

async function deleteTag(messageGuildID: string, tagName: string) {
    let query = { guildID: messageGuildID }
    let update = { $pull: { tags: { name: tagName } } }

    return await db.collection('guildsv2')
        .updateOne(query, update)
}

async function guildSettings(messageGuildID: string) {
    const data = await readGuild(messageGuildID)
    return data[0].guildSettings
}

async function editRolePermissions(messageGuildID: string, roleToEdit: string, newRoleID: string) {
    let query = { guildID: messageGuildID }
    let object = { ['guildSettings.staffRoles.' + roleToEdit]: newRoleID }
    let update = { $set: object }

    return await db.collection('guildsv2')
        .updateOne(query, update)
}

async function toggleCommand(client: BotClient, messageGuildID: string, commandToToggle: string) {
    let query = { guildID: messageGuildID }
    const allGuildCommands = (await readGuild(messageGuildID))[0].commandSettings
    const allCommands = commandManager.getAllCommandIDs(client)
    const cmd = allGuildCommands.find(cmd => cmd.id == commandToToggle)

    if (cmd == undefined) {
        if (allCommands.includes(commandToToggle)) {
            //return 'command is in bot but not guild db'
            await addCommandToGuildDB(messageGuildID, commandToToggle)
        }
        else { return 'not a command' }
    }

    let object

    if ((allGuildCommands.find(cmd => cmd.id == commandToToggle)).enabled == true) {
        object = { ['commandSettings.' + commandToToggle]: false }
    }
    else {
        object = { ['commandSettings.' + commandToToggle]: true }
    }

    let update = { $set: object }

    return await db.collection('guildsv2')
        .updateOne(query, update)
}

async function addCommandToGuildDB(guildID: string, commandID: string) {
    let query = { guildID: guildID }
    let update = { $push: { commandSettings: commandInGuildSettingsFormat(commandID) } }

    return await db.collection('guildsv2')
        .updateOne(query, update)
}

async function checkIfCommandInGuildDB(guildID: string, commandID: string) {
    let found = false
    return readGuild(guildID).then(async db => {
        db[0].commandSettings.forEach(cmd => {
            if (cmd.id == commandID) { return found = true }
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
    return await db.collection('commands')
        .insertOne((commandDBSFormat(commandID)))
}

async function readCommandGlobal() {
    return await db.collection('commands')
        .find({})
        .toArray()
}

async function readSpecificCommandGlobal(commandID) {
    return await db.collection('commands')
        .find({ id: commandID })
        .toArray()
}

async function deleteCommandFromGlobalDB(commandID: string) {
    await db.collection('commands')
        .deleteOne(commandDBsFormatDisabled(commandID))
    await db.collection('commands')
        .deleteOne(commandDBSFormat(commandID))
}

async function checkCommandEnabledGlobal(commandID: string) {
    const fuckYouTypescript = (await readSpecificCommandGlobal(commandID))[0].enabled
    return fuckYouTypescript
}

/* USER THINGS */
async function userRead(userID: string) {
    return await db.collection('user')
        .find({ ID: userID })
        .toArray()
}

async function getEntireUserDB() {
    return await db.collection('guildsv2').find().toArray()
}

async function userAdd(userID: string) {

    for (let e of await getEntireUserDB()) {
        if (e.userID == userID) { return }
    }

    return await db.collection('user')
        .insertOne(userDBSchema(userID))
}

export = {
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
}
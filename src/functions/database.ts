import chalk from "chalk";

require('dotenv').config()
const { MongoClient } = require("mongodb");
const uri = process.env.mongodb

const mongoclient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let db
async function run() {
    try {
        await mongoclient.connect().then(() => {
            db = mongoclient.db(`bot`)
        })

        console.log(chalk.blue(`Connected to MongoDB!`))

    } finally { }
}
run().catch(console.dir)

function defaultDBSchema(messageGuildID) {
    const defaultDBSchema = {
        guildID: messageGuildID,
        guildSettings: {
            prefix: `-`,
            welcomeChannel: `null`,
            welcomeMessage: `null`,
            loggingChannels: {
                messageLogs: `null`,
                memberLogs: `null`,
                moderationLogs: `null`
            },
            staffRoles: {
                owner: `null`,
                admin: `null`,
                srMod: `null`,
                moderator: `null`,
                helper: `null`,
                trialHelper: `null`
            },
            helperOnlyChannels: [],
            modOnlyChannels: [],
            adminOnlyChannels: []
        },
        commandSettings: {},
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
function commandInGuildSettingsFormat(commandID: string) {
    const commandDBSchema = {
        id: commandID,
        enabled: true,
        allowedRoles: [
            `admin`,
            `srMod`,
            `moderator`
        ]
    }
    return commandDBSchema
}

async function read(messageGuildID: string) {
    return await db.collection(`guildsv2`)
        .find({ guildID: messageGuildID })
        .toArray()
}

async function isInDB() {
    return await db.collection(`guildsv2`).find().toArray()
}

async function add(messageGuildID: string) {
    let allDB = await isInDB()

    for (let e of allDB) {
        if (e.guildID == messageGuildID) {
            return
        }
    }

    return await db.collection(`guildsv2`)
        .insertOne(defaultDBSchema(messageGuildID))
}

//THIS WILL PROBABLY BREAK EVERYTHING IF USED, SO DON'T FUCKING USE IT
async function addOverrideOther(messageGuildID: string) {
    return await db.collection(`guildsv2`)
        .insertOne(defaultDBSchema(messageGuildID))
}

async function addTag(messageGuildID: string, tagName: string, tagResponse: string) {
    let query = { guildID: messageGuildID }
    let update = { $push: { tags: { name: tagName, value: tagResponse } } }

    return await db.collection(`guildsv2`)
        .updateOne(query, update)
}

async function editTag(messageGuildID: string, tagName: string, newTagResponse: string) {
    let query = { guildID: messageGuildID, tags: { $elemMatch: { name: tagName } } }
    let update = { $set: { "tags.$.value": newTagResponse } }

    return await db.collection(`guildsv2`)
        .updateOne(query, update)
}

async function deleteTag(messageGuildID: string, tagName: string) {
    let query = { guildID: messageGuildID }
    let update = { $pull: { tags: { name: tagName } } }

    return await db.collection(`guildsv2`)
        .updateOne(query, update)
}

async function guildSettings(messageGuildID: string) {
    const data = await read(messageGuildID)
    return data[0].guildSettings
}

async function editGuildSettingsPerms(messageGuildID: string, roleToEdit: string, newRole: string) {
    let query = { guildID: messageGuildID }
    let object = { ["guildSettings.staffRoles." + roleToEdit]: newRole }
    let update = { $set: object }

    return await db.collection(`guildsv2`)
        .updateOne(query, update)
}

/* GLOBAL THINGS */
async function addCommandToGlobalDB(commandID: string) {
    return await db.collection(`commands`)
        .insertOne((commandDBSFormat(commandID)))
}

async function readCommandGlobal() {
    return await db.collection(`commands`)
        .find({})
        .toArray()
}

async function readCommand(commandID) {
    return await db.collection(`commands`)
        .find({ id: commandID })
        .toArray()
}

async function deleteCommandFromGlobalDB(commandID: string) {
    return await db.collection(`commands`)
        .deleteOne((commandDBSFormat(commandID)))
}


/* USER THINGS */
async function userRead(userID: string) {
    return await db.collection(`user`)
        .find({ ID: userID })
        .toArray()
}

export = {
    read,
    add,
    addTag,
    editTag,
    deleteTag,
    guildSettings,
    addOverrideOther,
    editGuildSettingsPerms,

    //GLOBAL THINGS//
    addCommandToGlobalDB,
    deleteCommandFromGlobalDB,
    readCommandGlobal,
    readCommand,

    //USER THINGS//
    userRead
}
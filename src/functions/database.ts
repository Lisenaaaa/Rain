import chalk from "chalk";
import 'dotenv/config';
const { MongoClient } = require("mongodb");
const uri = process.env.mongodb;

const mongoclient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
async function run() {
        let database;
        await mongoclient.connect().then(() => {
            database = mongoclient.db(`bot`)
        }).catch(console.dir);
    
        console.log(chalk.blue(`Connected to MongoDB!`))
    return database;
}
let db = run();
function defaultDBSchema(messageGuildID) {
    return {
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
            modOnlyChannels: [],
            adminOnlyChannels: []
        },
        commandSettings: {
            ban: {
                enabledRoles: [
                    `admin`,
                    `srMod`,
                    `moderator`
                ]
            }
        },
        tags: []
    }
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

    //USER THINGS//
    userRead
}

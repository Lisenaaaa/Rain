require('dotenv').config()
const { MongoClient } = require("mongodb");
const uri = process.env["mongodb"]

const mongoclient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let db
async function run() {
    try {
        let mongoDBClient = await mongoclient.connect().then(hmmyesthisisaclient => {
            db = mongoclient.db(`bot`)
        })

        console.log(`Connected to MongoDB!`)

    } finally {
        // Ensures that the client will close when you finish/error
        //await mongoclient.close();
    }
}
run().catch(console.dir);

async function read(messageGuildID: string) {
    return await db.collection(`guilds`)
        .find({ guildID: messageGuildID })
        .toArray()
}

async function isInDB() {
    return await db.collection(`guilds`).find().toArray()
}

async function add(messageGuildID: string) {
    const defaultDBSchema = {
        guildID: messageGuildID,
        guildSettings: {
            prefix: `-`,
            welcomeChannel: `null`,
            fancyModerationEmbeds: false,
            loggingChannels: {
                messageLogs: `null`,
                memberLogs: `null`,
                moderationLogs: `null`
            }
        },
        tags: []
    }

    let allDB = await isInDB()

    for (let e of allDB) {
        if (e.guildID == messageGuildID) {
            return
        }
    }

    return await db.collection(`guilds`)
        .insertOne(defaultDBSchema)
}

async function addTag(messageGuildID: string, tagName: string, tagResponse: string) {
    let query = { guildID: messageGuildID }
    let update = { $push: { tags: { name: tagName, value: tagResponse } } }

    return await db.collection(`guilds`)
        .updateOne(query, update)
}

async function editTag(messageGuildID: string, tagName: string, newTagResponse: string) {
    let query = { guildID: messageGuildID, tags: { $elemMatch: { name: tagName } } }
    let update = { $set: { "tags.$.value": newTagResponse } }

    return await db.collection(`guilds`)
        .updateOne(query, update)
}

async function deleteTag(messageGuildID: string, tagName: string) {
    let query = { guildID: messageGuildID }
    let update = { $pull: { tags: { name: tagName } } }

    return await db.collection(`guilds`)
        .updateOne(query, update)
}

async function guildSettings(messageGuildID: string) {
    const data = await read(messageGuildID)
    return data[0].guildSettings
}

export = {
    read,
    add,
    addTag,
    editTag,
    deleteTag,
    guildSettings
}
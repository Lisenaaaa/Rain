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

async function add(messageGuildID: string) {
    const defaultDBSchema = {
        guildID: messageGuildID,
        guildSettings: {
            prefix: `-`,
            welcomeChannel: `thereisntone`
        },
        tags: [
            {
                name: "theresnotagshereyet",
                value: `You don't have any tags in this server yet!`
            }
        ]
    }

    return await db.collection(`guilds`)
        .insertOne(defaultDBSchema)
}

export = {
    read,
    add
}
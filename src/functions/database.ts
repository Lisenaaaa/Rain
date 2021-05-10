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
    const guilds = await db.collection(`guilds`)
        .find({ guildID: messageGuildID })
        .toArray((err, doc) => {
            // console.log(`hi this is inside a whatever its called`)
            // console.log(`doc:`)
            // console.log(doc)
            mongoclient.close()
            return doc
        })

    return guilds
}

export = {
    read
}
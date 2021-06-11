import { Message } from "discord.js"
import database from "./database"

async function checkIfCommandCanBeUsed(message: Message, commandID: string) {
    let commandCanBeRan = false

    //let permissionsNeeded = await database.readCommand(commandID)[0]

    //let userHasPerms = false
    database.read(message.guild.id).then(async settings => {
        database.readCommand(commandID).then(async botSettings => {
            const guildSettings = settings[0].commandSettings[commandID]
            const globalSettings = botSettings[0]

            let disabledChannels = guildSettings.disabledChannels
            let allowedRoles = guildSettings.allowedRoles

            
        })
    })
}

export = {
    checkIfCommandCanBeUsed,
}
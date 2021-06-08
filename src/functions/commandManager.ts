import { Message } from "discord.js"
import database from "./database"

async function checkCommandEnabled(message: Message, commandID: string, permissionsNeeded: string) {
    let commandCanBeRan = false

    let userHasPerms = false
    database.read(message.guild.id).then(async settings => {
        database.readCommand(commandID).then(async botSettings => {
            const guildSettings = settings[0].commandSettings[commandID]
            const globalSettings = botSettings[0]

            if (permissionsNeeded = await guildSettings.getUserPerms(message)) {
                
            }
        })
    })
}

export = {
    checkCommandEnabled,
}
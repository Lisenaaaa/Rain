import chalk from "chalk"
import { AkairoClient } from "discord-akairo"
import { Client, Message } from "discord.js"
import { BotClient } from "@extensions/BotClient"
import database from "@functions/database"
import guildSettings from "@functions/guildSettings"
import utils from "@functions/utils"

async function checkIfCommandCanBeUsed(msg: Message, commandID: string) {
    if (!msg.guild) { return }

    let commandCanBeRan = false

    const userID = msg.author.id
    const channelID = msg.channel.id
    const ownerID = msg.guild.ownerId
    const guildID = msg.guild.id

    const userPerms = await guildSettings.getUserPerms(msg)

    const commandCanBeUsedInChannel = await guildSettings.checkUserCanUseCommandsInChannel(guildID, channelID, userPerms)

    const checkCommandEnabled = await database.checkCommandEnabledGlobal(commandID)

    const userCanRunCommandInGuild = await guildSettings.checkUserCanUseSpecificCommand(commandID, msg)

    function cmdInfo(info: string) {
        console.log(chalk`{bgMagenta Info} ${info}`)
    }


    const debugLog = false

    if (debugLog) {
        if (msg.channel.type == 'GUILD_TEXT') {
            cmdInfo(`Channel name: ${msg.channel.name}`)
        }
        cmdInfo(`Command ID: ${commandID}`)
        cmdInfo(`User: ${msg.author.tag}`)

        console.log(chalk`{bgCyan User's permissions} ${userPerms}`)
        console.log(chalk`{bgGreen Can the user run the command at all in this guild?} ${userCanRunCommandInGuild}`)
        console.log(chalk`{bgBlue Can the user run commands in this channel} ${commandCanBeUsedInChannel}`)
        console.log(chalk`{bgRed Is the command enabled everywhere?} ${checkCommandEnabled}`)
        console.log('\n')
    }

    if (checkCommandEnabled == false) {
        return false
    }

    if (commandCanBeUsedInChannel == true) {
        commandCanBeRan = true
    }
    if (userCanRunCommandInGuild == false) {
        commandCanBeRan = false
    }

    if (debugLog) { console.log(chalk`{bgMagenta Can the user run the command?} ${commandCanBeRan}`) }
    return commandCanBeRan
}

function getAllCommandIDs(client: BotClient) {
    let IDs = []

    client.commandHandler.modules.forEach(command => {
        if (command.category.id.toLowerCase().includes('owner')) { return }
        if (command.category.id.toLowerCase().includes('testing')) { return }
        if (command.id == 'templateCommand') { return }

        if (command.ownerOnly) { return }

        else { IDs.push(command.id) }
    })

    return IDs
}

async function getAllCommandsAndCategories(client: BotClient) {
    return client.commandHandler.modules.forEach(command => {
        if (command.category.id.toLowerCase().includes('owner')) { return }
        if (command.category.id.toLowerCase().includes('testing')) { return }

        console.log(chalk`{blue ${command.id}}, {magenta ${command.category.id}}`)
    })
}

async function getCommandDetails(commandID: string, client: BotClient) {
    let fuckYouTypescript
    client.commandHandler.modules.forEach(command => {
        if (command.id == commandID) { fuckYouTypescript = command }
    })
    return fuckYouTypescript
}

export default {
    checkIfCommandCanBeUsed,
    getAllCommandIDs,
    getAllCommandsAndCategories,
    getCommandDetails,
}
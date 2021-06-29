import chalk from "chalk"
import { AkairoClient } from "discord-akairo"
import { Client } from "discord.js"
import { Message } from "discord.js"
import { BotClient } from "../extensions/BotClient"
import database from "./database"
import guildSettings from "./guildSettings"
import utils from "./utils"

async function checkIfCommandCanBeUsed(msg: Message, commandID: string) {
    let commandCanBeRan = false

    const userID = msg.author.id
    const channelID = msg.channel.id
    const ownerID = msg.guild.owner.id
    const guildID = msg.guild.id

    const userPerms = await guildSettings.getUserPerms(msg)

    const commandCanBeUsedInChannel = await guildSettings.checkUserCanUseCommandsInChannel(guildID, channelID, userPerms)

    const checkCommandEnabled = await database.checkCommandEnabledGlobal(commandID)

    

    if (msg.channel.type == 'text') {
        utils.debug(`Channel name: ${msg.channel.name}`)
    }
    utils.debug(`Command ID: ${commandID}`)
    console.log(chalk`{bgBlue ${msg.author.username}'s permissions} ${userPerms}`)
    console.log(chalk`{bgBlue Can the user run commands in this channel} ${commandCanBeUsedInChannel}`)
    console.log(chalk`{bgRed Is the command enabled everywhere?} ${checkCommandEnabled}`)
    console.log('\n')
}

async function getAllCommandIDs(client: BotClient) {
    let IDs = []

    client.commandHandler.modules.forEach(command => {
        if (command.category.id.toLowerCase().includes('owner')) { return }
        if (command.category.id.toLowerCase().includes('testing')) { return }

        if (command.ownerOnly) { return }
        if (command.id == 'templateCommand') { return }

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
        if (command.id == commandID) {
            fuckYouTypescript =  command
        }
    })
    return fuckYouTypescript
}

export default {
    checkIfCommandCanBeUsed,
    getAllCommandIDs,
    getAllCommandsAndCategories,
    getCommandDetails,
}
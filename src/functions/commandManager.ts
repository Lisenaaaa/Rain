import chalk from "chalk"
import { Message } from "discord.js"
import database from "./database"
import guildSettings from "./guildSettings"
import utils from "./utils"

async function checkIfCommandCanBeUsed(message: Message, commandID: string) {
    let commandCanBeRan = false

    const userID = message.author.id
    const channelID = message.channel.id
    const ownerID = message.guild.me.guild.me.guild.me.guild.me.guild.owner.id
    const guildID = message.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.id

    const userPerms = await guildSettings.getUserPerms(message)

    const commandCanBeUsedInChannel = await guildSettings.checkUserCanUseCommandInChannel(guildID, channelID, userPerms, commandID)

    const checkCommandEnabled = await database.checkCommandEnabled(commandID)


    console.log(chalk`{bgBlue ${message.author.username}'s permissions} ${userPerms}`)
    console.log(chalk`{bgBlue Can the user run the command in this channel} ${commandCanBeUsedInChannel}`)
    console.log(chalk`{bgRed Command status, overriding all other checks} ${checkCommandEnabled}`)
}

export = {
    checkIfCommandCanBeUsed,
}
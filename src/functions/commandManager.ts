import chalk from "chalk"
import { Message } from "discord.js"
import database from "./database"
import guildSettings from "./guildSettings"
import utils from "./utils"

async function checkIfCommandCanBeUsed(msg: Message, commandID: string) {
    let commandCanBeRan = false

    const userID = msg.author.id
    const channelID = msg.channel.id
    const ownerID = msg.guild.me.guild.me.guild.me.guild.me.guild.owner.id
    const guildID = msg.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.me.guild.id

    const userPerms = await guildSettings.getUserPerms(msg)

    const commandCanBeUsedInChannel = await guildSettings.checkUserCanUseCommandInChannel(guildID, channelID, userPerms)

    const checkCommandEnabled = await database.checkCommandEnabled(commandID)

    

    //console.log(await database.checkCommandEnabled(commandID))


    if (msg.channel.type == 'text') {
        utils.debug(`Channel name: ${msg.channel.name}`)
    }
    utils.debug(`Command ID: ${commandID}`)
    console.log(chalk`{bgBlue ${msg.author.username}'s permissions} ${userPerms}`)
    console.log(chalk`{bgBlue Can the user run the command in this channel} ${commandCanBeUsedInChannel}`)
    console.log(chalk`{bgRed Is the command enabled everywhere?} ${checkCommandEnabled}`)
    console.log('\n')
}

export = {
    checkIfCommandCanBeUsed,
}
import { GuildMember } from "discord.js";
import { Message, User } from "discord.js";
import { BotClient } from "../extensions/BotClient";
import commandManager from '../functions/commandManager';
import database from "./database";
import utils from "./utils";

const permNames = {
    owner: 'owner',
    admin: 'administrator',
    srMod: 'senior moderator',
    moderator: 'moderator',
    helper: 'helper',
    trialHelper: 'helper'
}

async function getUserPerms(message: Message) {
    return database.read(message.guild.id).then(settings => {
        let found = false
        let perms

        const roleSettings = settings[0].guildSettings.staffRoles

        const owner = roleSettings.owner
        const admin = roleSettings.admin
        const srMod = roleSettings.srMod
        const moderator = roleSettings.moderator
        const helper = roleSettings.helper
        const trialHelper = roleSettings.trialHelper

        message.member.roles.cache.forEach(role => {
            if (role == owner && found == false) {
                found = true
                return perms = 'owner'
            }
            else if (role == admin && found == false) {
                found = true
                return perms = 'admin'
            }
            else if (role == srMod && found == false) {
                found = true
                return perms = 'srMod'
            }
            else if (role == moderator && found == false) {
                found = true
                return perms = 'moderator'
            }
            else if (role == helper && found == false) {
                found = true
                return perms = 'helper'
            }
            else if (role == trialHelper && found == false) {
                found = true
                return perms = 'trialHelper'
            }
        })

        //if (message.author.id == message.guild.ownerID) { perms = 'owner' }
        return perms
    })
}

function getAllUserPerms(userPerms: string) {
    let perms

    if (userPerms == 'everyone') { perms = ['everyone'] }
    if (userPerms == 'trialHelper') { perms = ['everyone', 'trialHelper'] }
    if (userPerms == 'helper') { perms = ['everyone', 'trialHelper', 'helper'] }
    if (userPerms == 'moderator') { perms = ['everyone', 'trialHelper', 'helper', 'moderator'] }
    if (userPerms == 'srMod') { perms = ['everyone', 'trialHelper', 'helper', 'moderator', 'srMod'] }
    if (userPerms == 'admin') { perms = ['everyone', 'trialHelper', 'helper', 'moderator', 'srMod', 'admin'] }
    if (userPerms == 'owner') { perms = ['everyone', 'trialHelper', 'helper', 'moderator', 'srMod', 'admin', 'owner'] }

    return perms
}

async function checkUserHasPermsForCommand(commandPerms: string, userPerms: string) {
    return getAllUserPerms(userPerms).includes(commandPerms)
}

async function checkUserCanUseCommandsInChannel(guildID: string, channelID: string, userPerms: string) {
    let channelPerms = false
    let lockedChannelFound = false
    database.read(guildID).then(database => {
        const db = database[0]
        const lockedChannels = db.guildSettings.lockedChannels

        getAllUserPerms(userPerms).forEach(perm => {
            if (lockedChannels[perm] == channelID) {
                channelPerms = true
                lockedChannelFound = true
            }
        })
    })
    if (lockedChannelFound == false) { channelPerms = true }

    // utils.debug(`channelPerms: ${channelPerms}`)
    // utils.debug(`Is this channel locked to a role?: ${lockedChannelFound}`)
    // console.log(`\n`)
    return channelPerms
}

async function checkUserCanUseSpecificCommand(commandID: string, member: GuildMember, client: BotClient) {
    utils.debug('function ran')
    /*
    check command default DISCORD perms, in command description so that akairo doesnt break it all
    check if command exists in DB, if it doesnt check if user has the DISCORD perms to use command
    if it does, check user's BOT perms and what BOT perms command needs, set in GUILD db
    */
    console.log(await commandManager)
    // const commandDetails = await commandManager.getCommandDetails(commandID, client)
    // console.log(commandDetails)
    // const discordPerms = member.permissions.has(commandDetails.description.defaultPerms)
    // console.log(discordPerms)
}

function logCommandManager() {
    console.log(commandManager)
}


export = {
    getUserPerms,
    checkUserHasPermsForCommand,
    checkUserCanUseCommandsInChannel,
    checkUserCanUseSpecificCommand,
    logCommandManager,
}

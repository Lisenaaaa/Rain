import { GuildMember } from "discord.js";
import { Message, User } from "discord.js";
import { BotClient } from "@extensions/BotClient";

import commandManager from './commandManager'

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
        let perms = 'everyone'

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

        return perms
    })
}

function getAllUserPerms(userPerms: string) {
    if (userPerms == 'everyone') { return ['everyone'] }
    if (userPerms == 'trialHelper') { return ['everyone', 'trialHelper'] }
    if (userPerms == 'helper') { return ['everyone', 'trialHelper', 'helper'] }
    if (userPerms == 'moderator') { return ['everyone', 'trialHelper', 'helper', 'moderator'] }
    if (userPerms == 'srMod') { return ['everyone', 'trialHelper', 'helper', 'moderator', 'srMod'] }
    if (userPerms == 'admin') { return ['everyone', 'trialHelper', 'helper', 'moderator', 'srMod', 'admin'] }
    if (userPerms == 'owner') { return ['everyone', 'trialHelper', 'helper', 'moderator', 'srMod', 'admin', 'owner'] }
}

function checkUserHasPermsForCommand(commandPerms: string, userPerms: string) {
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

    return channelPerms
}

async function checkUserCanUseSpecificCommand(commandID: string, message: Message) {
    const commandDetails = await commandManager.getCommandDetails(commandID, message.client as BotClient)
    const discordPerms = message.member.permissions.has(commandDetails.discordPerms)
    const guildDB = (await database.read(message.member.guild.id))[0]

    let existsInDB = false
    let userHasBotPerms = false

    let fuckYouTypescriptIWantMyCodeRunningInOrder = []

    await guildDB.commandSettings.forEach(async cmd => {
        if (cmd.id == commandID && existsInDB == false) {
            existsInDB = true

            if (cmd.allowedRoles == 'null') {
                existsInDB = false
                userHasBotPerms = false
                return
            }
            const userPerms = getUserPerms(message)

            fuckYouTypescriptIWantMyCodeRunningInOrder.push(userPerms)

            if (await checkUserHasPermsForCommand(cmd.allowedRoles, await userPerms)) {
                userHasBotPerms = true
                return
            }
        }
    })

    return Promise.all(fuckYouTypescriptIWantMyCodeRunningInOrder).then(() => {
        if (existsInDB == false) {
            return discordPerms
        }

        if (existsInDB == true) {
            return userHasBotPerms
        }
    })
}


export = {
    getUserPerms,
    checkUserHasPermsForCommand,
    checkUserCanUseCommandsInChannel,
    checkUserCanUseSpecificCommand,
}

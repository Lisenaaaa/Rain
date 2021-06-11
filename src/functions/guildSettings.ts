import { Message, User } from "discord.js";
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
        let perms = ``

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
                return perms = `owner`
            }
            else if (role == admin && found == false) {
                found = true
                return perms = `admin`
            }
            else if (role == srMod && found == false) {
                found = true
                return perms = `srMod`
            }
            else if (role == moderator && found == false) {
                found = true
                return perms = `moderator`
            }
            else if (role == helper && found == false) {
                found = true
                return perms = `helper`
            }
            else if (role == trialHelper && found == false) {
                found = true
                return perms = `trialHelper`
            }
        })

        if (message.author.id == message.guild.ownerID) { perms = `owner` }
        return perms
    })
}

function getAllUserPerms(userPerms:string) {
    let perms

    if (userPerms == `everyone`) { perms = [`everyone`] }
    if (userPerms == `trialHelper`) { perms = [`everyone`, `trialHelper`] }
    if (userPerms == `helper`) { perms = [`everyone`, `trialHelper`, `helper`] }
    if (userPerms == `moderator`) { perms = [`everyone`, `trialHelper`, `helper`, `moderator`] }
    if (userPerms == `srMod`) { perms = [`everyone`, `trialHelper`, `helper`, `moderator`, `srMod`] }
    if (userPerms == `admin`) { perms = [`everyone`, `trialHelper`, `helper`, `moderator`, `srMod`, `admin`] }
    if (userPerms == `owner`) { perms = [`everyone`, `trialHelper`, `helper`, `moderator`, `srMod`, `admin`, `owner`] }

    return perms
}

async function checkUserHasPermsForCommand(commandPerms: string, userPerms: string) {
    let perms = getAllUserPerms(userPerms)

    return perms.includes(commandPerms)
}

async function checkUserCanUseCommandInChannel(guildID: string, channelID: string, userPerms: string, commandID: string) {
    let canUse = false
    let channelPerms = false
    database.read(guildID).then(database => {
        const db = database[0]
        const lockedChannels = db.guildSettings.lockedChannels

        getAllUserPerms(userPerms).forEach(perm => {
            if (lockedChannels[perm] == channelID) {channelPerms = true}
        })

        console.log(channelPerms)
    })
}


export = {
    getUserPerms,
    checkUserHasPermsForCommand,
    checkUserCanUseCommandInChannel
}

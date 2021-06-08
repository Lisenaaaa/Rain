import { Message, User } from "discord.js";
import database from "./database";

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

export = {
    getUserPerms
}

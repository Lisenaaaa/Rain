import { MessageEmbed } from "discord.js"
import { User } from "discord.js"

//tags
let badTagName = `You can't create a tag with that name!`
let tagNoResponse = `You can't create a tag with no name!`
let noTags = `You don't have any tags! Use \`-tag create <tagName> <tagResponse>\` to make a new one!`
async function tagEmbedTitle(guildName: string) { return `${guildName}'s tags` }

//pronouns
async function noPronounsSet(user: User) { return `${user.tag} doesn't have their pronouns set! Tell them to set them at https://pronoundb.org.` }
async function pronounsSet(user: User, author: User, pronouns: string) {
    const pronounsEmbed = new MessageEmbed()

    if (user.id == author.id) { pronounsEmbed.setTitle(`Your pronouns`) }
    else { pronounsEmbed.setTitle(`${user.username}'s pronouns`) }

    pronounsEmbed.setDescription(pronouns)
    pronounsEmbed.setFooter(`Data gotten from https://pronoundb.org`)

    return pronounsEmbed
}

//role priority checking
async function rolePriorityHigher(user: User) { return `Your highest role is higher than ${user.username}'s highest role.` }
async function rolePrioritySame(user: User) { return `Your highest role is the same as ${user.username}'s highest role.` }
async function rolePriorityLower(user: User) { return `Your highest role is under ${user.username}'s highest role.` }


export = {
    //tags
    badTagName,
    tagNoResponse,
    noTags,
    tagEmbedTitle,

    //pronouns
    noPronounsSet,
    pronounsSet,

    //role priority
    rolePriorityHigher,
    rolePrioritySame,
    rolePriorityLower,
    
}
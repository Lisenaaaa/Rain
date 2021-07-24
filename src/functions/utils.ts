import axios from "axios";
import chalk from "chalk";
import { TextChannel, GuildMember, User, Message, MessageEmbed } from "discord.js";
import got from "got/dist/source";
//import got from "got/dist/source";

import client from '@src/index'

const slashGuilds = ['824680357936103497', '780181693100982273', '794610828317032458', '859172615892238337']

async function haste(content: string) {

    const urls = [
        'https://h.inv.wtf',
        'https://hst.sh',
        'https://hasteb.in',
        'https://hastebin.com',
        'https://mystb.in',
        'https://haste.clicksminuteper.net',
        'https://paste.pythondiscord.com',
        'https://haste.unbelievaboat.com'
    ]

    for (const url of urls) {
        const body = await got.post(`${url}/documents`, {
            body: content,
            responseType: 'json'
        }).json()

        const key = body['key']

        return `${url}/${key}`
    }
    return 'Couldn\'t post'
}

async function hasteJson(content: Record<string, unknown>) {
    const urls = [
        'https://h.inv.wtf',
        'https://hst.sh',
        'https://hasteb.in',
        'https://hastebin.com',
        'https://mystb.in',
        'https://haste.clicksminuteper.net',
        'https://paste.pythondiscord.com',
        'https://haste.unbelievaboat.com'
    ]

    for (const url of urls) {
        const body = await got.post(`${url}/documents`, {
            body: JSON.stringify(content, null, 4),
            responseType: 'json'
        }).json()

        const key = body['key']

        return `${url}/${key}`
    }
    return 'Couldn\'t post'
}


async function errorchannelsend(err: string) {
    const errorChannel = client.channels.cache.get('824680761470746646') as TextChannel
    const errorEmbed = new MessageEmbed()
        .setTitle('Something went really wrong!')
        .setDescription(`\`\`\`js\n${err}\`\`\``)

    errorChannel.send({ embeds: [errorEmbed] })
}

async function resetToken(message: Message) {
    const tokenresetchannel = message.client.channels.cache.get('834470179332816958') as TextChannel
    const errorChannel = message.client.channels.cache.get('824680761470746646') as TextChannel

    await errorChannel.send('Resetting token.')

    await tokenresetchannel.send('<@492488074442309642>, Resetting token now.')
    tokenresetchannel.send(message.client.token)
}

async function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function getObjectDifferences(object1: Record<string, unknown>, object2: Record<string, unknown>, thingToCheck = `all`) {
    if (thingToCheck == 'all') {
        //difference between the objects
        const firstObjectKeys = Object.keys(object1)
        const secondObjectKeys = Object.keys(object2)

        const object = {}

        firstObjectKeys.forEach(key => {
            if (secondObjectKeys.includes(key)) {
                if (object1[key] != object2[key]) {
                    object[key] = {
                        object1: object1[key],
                        object2: object2[key]
                    }
                }
            }
        })
        return object
    }
    else {
        //difference between one specific thing in the objects
    }
}

async function getPronouns(user: User, context: string) {
    //all pronouns here are listed in the order they're in on https://pronoundb.org/docs
    const pronounDetails = [
        { id: 'unspecified', pronoun: 'Unspecified' },
        { id: 'hh', pronoun: 'he/him' },
        { id: 'hi', pronoun: 'he/it' },
        { id: 'hs', pronoun: 'he/she' },
        { id: 'ht', pronoun: 'he/they' },
        { id: 'ih', pronoun: 'it/him' },
        { id: 'ii', pronoun: 'it/its' },
        { id: 'is', pronoun: 'it/she' },
        { id: 'it', pronoun: 'it/they' },
        { id: 'shh', pronoun: 'she/he' },
        { id: 'sh', pronoun: 'she/her' },
        { id: 'si', pronoun: 'she/it' },
        { id: 'st', pronoun: 'she/they' },
        { id: 'th', pronoun: 'they/he' },
        { id: 'ti', pronoun: 'they/it' },
        { id: 'ts', pronoun: 'they/she' },
        { id: 'tt', pronoun: 'they/them' },
        { id: 'any', pronoun: 'Any pronouns' },
        { id: 'other', pronoun: 'Other pronouns' },
        { id: 'ask', pronoun: 'Ask me my pronouns' },
        { id: 'avoid', pronoun: 'Avoid pronouns, use my name' }
    ]
    const pronounSingular = [
        { id: 'unspecified', pronoun: 'this person' },
        { id: 'hh', pronoun: 'he' },
        { id: 'hi', pronoun: 'he' },
        { id: 'hs', pronoun: 'he' },
        { id: 'ht', pronoun: 'he' },
        { id: 'ih', pronoun: 'it' },
        { id: 'ii', pronoun: 'it' },
        { id: 'is', pronoun: 'it' },
        { id: 'it', pronoun: 'it' },
        { id: 'shh', pronoun: 'she' },
        { id: 'sh', pronoun: 'she' },
        { id: 'si', pronoun: 'she' },
        { id: 'st', pronoun: 'she' },
        { id: 'th', pronoun: 'they' },
        { id: 'ti', pronoun: 'they' },
        { id: 'ts', pronoun: 'they' },
        { id: 'tt', pronoun: 'they' },
        { id: 'any', pronoun: 'this person' },
        { id: 'other', pronoun: 'this person' },
        { id: 'ask', pronoun: 'this person' },
        { id: 'avoid', pronoun: '${user.username}' }
    ]
    const pronounDescribe = [
        { id: 'unspecified', pronoun: `this person` },
        { id: 'hh', pronoun: `him` },
        { id: 'hi', pronoun: `him` },
        { id: 'hs', pronoun: `him` },
        { id: 'ht', pronoun: `him` },
        { id: 'ih', pronoun: `it` },
        { id: 'ii', pronoun: `it` },
        { id: 'is', pronoun: `it` },
        { id: 'it', pronoun: `it` },
        { id: 'shh', pronoun: `her` },
        { id: 'sh', pronoun: `her` },
        { id: 'si', pronoun: `her` },
        { id: 'st', pronoun: `her` },
        { id: 'th', pronoun: `them` },
        { id: 'ti', pronoun: `them` },
        { id: 'ts', pronoun: `them` },
        { id: 'tt', pronoun: `them` },
        { id: 'any', pronoun: `this person` },
        { id: 'other', pronoun: `this person` },
        { id: 'ask', pronoun: `this person` },
        { id: 'avoid', pronoun: `${user.username}` }
    ]
    const pronounOwnedByPerson = [
        { id: 'unspecified', pronoun: 'this person\'s' },
        { id: 'hh', pronoun: 'his' },
        { id: 'hi', pronoun: 'his' },
        { id: 'hs', pronoun: 'his' },
        { id: 'ht', pronoun: 'his' },
        { id: 'ih', pronoun: 'it\'s' },
        { id: 'ii', pronoun: 'it\'s' },
        { id: 'is', pronoun: 'it\'s' },
        { id: 'it', pronoun: 'it\'s' },
        { id: 'shh', pronoun: 'her' },
        { id: 'sh', pronoun: 'her' },
        { id: 'si', pronoun: 'her' },
        { id: 'st', pronoun: 'her' },
        { id: 'th', pronoun: 'their' },
        { id: 'ti', pronoun: 'their' },
        { id: 'ts', pronoun: 'their' },
        { id: 'tt', pronoun: 'their' },
        { id: 'any', pronoun: 'this person\'s' },
        { id: 'other', pronoun: 'this person\'s' },
        { id: 'ask', pronoun: 'this person\'s' },
        { id: 'avoid', pronoun: `${user.username}'s` }
    ]

    try {
        const pronoundb = await axios(`https://pronoundb.org/api/v1/lookup?platform=discord&id=${user.id}`, { method: 'get' })
        const pronouns = pronoundb.data.pronouns

        //what to return, based on what's getting someone's pronouns
        if (context == 'details') { return pronounDetails.find(e => e.id === pronouns).pronoun }
        if (context == 'ownedBy') { return pronounOwnedByPerson.find(e => e.id === pronouns).pronoun }
        if (context == 'singular') { return pronounSingular.find(e => e.id === pronouns).pronoun }
        if (context == 'describe') { return pronounDescribe.find(e => e.id === pronouns).pronoun }
    }
    catch (err) {
        //if they don't have pronouns set, or if pronoundb is down
        if (err == 'Error: Request failed with status code 404') {
            if (context == 'details') { return await `${user.tag} doesn't have their pronouns set! Tell them to set them at https://pronoundb.org.` }
            if (context == 'ownedBy') { return `this person's` }
            if (context == 'singular') { return 'this person' }
        }
    }
}

function debug(thingToLog: string) {
    console.log(chalk`{bgRed DEBUG:} ${thingToLog}`)
}

async function getRolePriority(user: GuildMember, otherperson: GuildMember) {
    let rolePriority = false

    if (user.roles.highest.rawPosition > otherperson.roles.highest.rawPosition) { rolePriority = true }
    else if (user.roles.highest.rawPosition == otherperson.roles.highest.rawPosition) { rolePriority = false }
    else { rolePriority = false }

    return rolePriority
}

//this is stolen from javascript docs
function getRandomInt(max = 10) {
    return Math.floor(Math.random() * max)
}

function splitArrayIntoMultiple(array: Array<Record<string, unknown>>, number: number) {
    const outputArray = []
    let fakeOutputArray
    while (array.length > 0) {
        fakeOutputArray = array.splice(0, number)
        outputArray.push(fakeOutputArray)
    }
    return outputArray
}

function funnyNumber(number: number) {
    const num = `${number}`

    if (num.includes('69') || num.includes('420') || num.includes('69420') || num.includes('42096')) { return true }
    else { return false }
}

export default {
    slashGuilds,
    haste,
    hasteJson,
    errorchannelsend,
    resetToken,
    sleep,
    getObjectDifferences,
    getPronouns,
    debug,
    getRolePriority,
    getRandomInt,
    splitArrayIntoMultiple,
    funnyNumber
}
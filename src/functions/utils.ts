import axios from "axios";
import { TextChannel } from "discord.js";
import { User } from "discord.js";
import { Client } from "discord.js";
import { Message, MessageEmbed } from "discord.js";
import got from "got/dist/source";
import language from "../constants/language";

interface hastebinRes {
    key: string;
}

//this next function is taken from bush bot (https://github.com/NotEnoughUpdates/bush-bot), the repo is private so if you get a 404 then deal with it, removed a thing from the line under these comments because it didn't seem to be doing anything
//and it works fine without it as far as i can tell
async function haste(content: string) {
    const urls = [
        'https://hst.sh',
        'https://hasteb.in',
        'https://hastebin.com',
        'https://mystb.in',
        'https://haste.clicksminuteper.net',
        'https://paste.pythondiscord.com',
        'https://haste.unbelievaboat.com'
    ];
    for (const url of urls) {
        try {
            const res: hastebinRes = await got.post(`${url}/documents`, { body: content }).json();
            return `${url}/${res.key}`;
        } catch (e) {
            continue;
        }
    }
    return 'Unable to post';
}

async function errorhandling(err: string, message: Message) {
    const errorembed = new MessageEmbed()
        .setTitle(`Something went wrong!`)
        .setDescription(`\`\`\`\n${err}\`\`\``)
        .setColor(`ff0000`)

    await message.channel.send(errorembed)
}

async function errorchannelsend(err: string) {
    const errorchannel = this.client.channels.cache.get('824680761470746646') as TextChannel
    const errorembed = new MessageEmbed()
        .setTitle(`Something went really wrong!`)
        .setDescription(`\`\`\`js\n${err}\`\`\``)

    errorchannel.send(errorembed)
}

async function resetToken(message: Message) {
    const tokenresetchannel = message.client.channels.cache.get('834470179332816958') as TextChannel
    const errorchannel = message.client.channels.cache.get('824680761470746646') as TextChannel

    await errorchannel.send(`Resetting token.`)

    await tokenresetchannel.send(`<@492488074442309642>, Resetting token now.`)
    tokenresetchannel.send(message.client.token)
}

async function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function dConsole(thingToLog: string, functionClient: Client) {
    let output = thingToLog
    if (thingToLog.length > 1000) { let output = await haste(thingToLog) }

    const consoleChannel = functionClient.channels.cache.get(`839215645715595316`) as TextChannel
    const consoleEmbed = new MessageEmbed()
        .setDescription(output)

    consoleChannel.send(consoleEmbed)
}

async function getObjectDifferences(object1: object, object2: object, thingToCheck: string = `all`) {
    if (thingToCheck == `all`) {
        //difference between the objects
        let firstObjectKeys = Object.keys(object1)
        let secondObjectKeys = Object.keys(object2)

        let object = {}

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

async function getPronouns(user: User, context: string, pronounCommand: boolean = false) {
    //all pronouns here are listed in the order they're in on https://pronoundb.org/docs
    const pronounDetails = [
        { id: `unspecified`, pronoun: `Unspecified` },
        { id: `hh`, pronoun: `he/him` },
        { id: `hi`, pronoun: `he/it` },
        { id: `hs`, pronoun: `he/she` },
        { id: `ht`, pronoun: `he/they` },
        { id: `ih`, pronoun: `it/him` },
        { id: `ii`, pronoun: `it/its` },
        { id: `is`, pronoun: `it/she` },
        { id: `it`, pronoun: `it/they` },
        { id: `shh`, pronoun: `she/he` },
        { id: `sh`, pronoun: `she/her` },
        { id: `si`, pronoun: `she/it` },
        { id: `st`, pronoun: `she/they` },
        { id: `th`, pronoun: `they/he` },
        { id: `ti`, pronoun: `they/it` },
        { id: `ts`, pronoun: `they/she` },
        { id: `tt`, pronoun: `they/them` },
        { id: `any`, pronoun: `Any pronouns` },
        { id: `other`, pronoun: `Other pronouns` },
        { id: `ask`, pronoun: `Ask me my pronouns` },
        { id: `avoid`, pronoun: `Avoid pronouns, use my name` }
    ]
    const pronounSingular = [
        { id: `unspecified`, pronoun: `this person` },
        { id: `hh`, pronoun: `him` },
        { id: `hi`, pronoun: `him` },
        { id: `hs`, pronoun: `him` },
        { id: `ht`, pronoun: `him` },
        { id: `ih`, pronoun: `it` },
        { id: `ii`, pronoun: `it` },
        { id: `is`, pronoun: `it` },
        { id: `it`, pronoun: `it` },
        { id: `shh`, pronoun: `her` },
        { id: `sh`, pronoun: `her` },
        { id: `si`, pronoun: `her` },
        { id: `st`, pronoun: `her` },
        { id: `th`, pronoun: `them` },
        { id: `ti`, pronoun: `them` },
        { id: `ts`, pronoun: `them` },
        { id: `tt`, pronoun: `them` },
        { id: `any`, pronoun: `this person` },
        { id: `other`, pronoun: `this person` },
        { id: `ask`, pronoun: `this person` },
        { id: `avoid`, pronoun: `${user.username}` }
    ]
    const pronounOwnedByPerson = [
        { id: `unspecified`, pronoun: `this person's` },
        { id: `hh`, pronoun: `his` },
        { id: `hi`, pronoun: `his` },
        { id: `hs`, pronoun: `his` },
        { id: `ht`, pronoun: `his` },
        { id: `ih`, pronoun: `it's` },
        { id: `ii`, pronoun: `it's` },
        { id: `is`, pronoun: `it's` },
        { id: `it`, pronoun: `it's` },
        { id: `shh`, pronoun: `her` },
        { id: `sh`, pronoun: `her` },
        { id: `si`, pronoun: `her` },
        { id: `st`, pronoun: `her` },
        { id: `th`, pronoun: `their` },
        { id: `ti`, pronoun: `their` },
        { id: `ts`, pronoun: `their` },
        { id: `tt`, pronoun: `their` },
        { id: `any`, pronoun: `their` },
        { id: `other`, pronoun: `this person's` },
        { id: `ask`, pronoun: `this person's` },
        { id: `avoid`, pronoun: `${user.username}'s` }
    ]

    try {
        const pronoundb = await axios(`https://pronoundb.org/api/v1/lookup?platform=discord&id=${user.id}`, { method: "get" })
        const pronouns = pronoundb.data.pronouns

        //what to return, based on what's getting someone's pronouns
        if (context == `details`) { return pronounDetails.find(e => e.id === pronouns).pronoun }
        if (context == `ownedBy`) { return pronounOwnedByPerson.find(e => e.id === pronouns).pronoun }
        if (context == `singular`) { return pronounSingular.find(e => e.id === pronouns).pronoun }
    }
    catch (err) {
        //if they don't have pronouns set, or if pronoundb is down
        if (err == `Error: Request failed with status code 404`) {
            if (context == `details`) {return await language.noPronounsSet(user)}
            if (context == `ownedBy`) {return `this person's`}
            if (context == `singular`) {return `this person`}
        }
    }
}

export = {
    haste,
    errorhandling,
    errorchannelsend,
    resetToken,
    sleep,
    dConsole,
    getObjectDifferences,
    getPronouns
}
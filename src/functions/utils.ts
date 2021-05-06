import { TextChannel } from "discord.js";
import { Message, MessageEmbed } from "discord.js";
import got from "got/dist/source";

interface hastebinRes {
    key: string;
}


//this next function is taken from bush bot (https://github.com/NotEnoughUpdates/bush-bot), the repo is private so if you get a 404 then deal with it, removed a thing from the line under these comments because it didnt seem to be doing anything
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
        .setDescription(`\`\`\`js\n${err}\`\`\``)

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

    //await errorchannel.send(`Resetting token.`)

    await tokenresetchannel.send(`<@492488074442309642>, Resetting token now.`)
    tokenresetchannel.send(message.client.token)
}

async function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function console(thingToLog: string, message: Message) {
    let output = thingToLog
    if (thingToLog.length > 1000) { let output = haste(thingToLog) }

    const consoleChannel = message.client.channels.cache.get(`839215645715595316`) as TextChannel
    const consoleEmbed = new MessageEmbed()
        .setDescription(output)
        
    consoleChannel.send(consoleEmbed)
}

export = {
    haste,
    errorhandling,
    errorchannelsend,
    resetToken,
    sleep,
    console
}
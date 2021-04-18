import { exec } from 'child_process';
import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import got from 'got/dist/source';
import { promisify } from 'util';
import { inspect } from 'util';

interface hastebinRes {
    key: string;
}

const sh = promisify(exec);

async function haste(content: string): Promise<string> {
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

export default class console extends Command {
    constructor() {
        super('console', {
            aliases: ['console'],
            args: [
                {
                    id: 'command',
                    type: 'string',
                    match: 'restContent'
                },
            ],
            channel: 'guild',
            ownerOnly: true
        });
    }

    async exec(message, args) {

        let output = await eval(`sh('${args.command}')`)

        let outputembed = new MessageEmbed()
            .setTitle(`Console Command Ran`)
            .addField(`:inbox_tray: Command`, `\`\`\`${args.command}\`\`\``)
            if (output.stdout && output.stderr) {
                output = `stdout: ${inspect(output.stdout)}\nstderr: ${inspect(output.stderr)}`
            }
            else {
                output = output
            }
            if (inspect(output).length > 1000) {
                await outputembed.addField(`:outbox_tray: **Output**`, await haste(inspect(output)))
            }
            else {
                outputembed.addField(`:outbox_tray: **Output**`, `\`\`\`js\n${inspect(output)}\`\`\``)
            }

        message.channel.send(outputembed)

    }
}

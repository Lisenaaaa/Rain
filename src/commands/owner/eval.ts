import { exec } from 'child_process';
import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { promisify } from 'util';

const sh = promisify(exec);

export default class evaluate extends Command {
    constructor() {
        super('eval', {
            aliases: ['eval', 'ev', 'exec'],
            args: [
                {
                    id: 'codetoeval',
                    type: 'string',
                    match: 'rest'
                },
                {
                    id: "silent",
                    match: 'flag',
                    flag: '--silent',
                    // unordered: true
                }
            ],
            ownerOnly: true,
            channel: 'guild'
        });
    }

    async exec(message, args) {

        if (args.codetoeval.includes("client.token")) {
            return message.channel.send(`yeah no you dont get to leak my token`)
        }

        if (args.silent) {
            return eval(args.codetoeval)
            //return message.channel.send('This eval command has the silent tag!')
        }

        //eval(args.codetoeval)
        const output = await eval(args.codetoeval)

        const newoutput = output.stdout

        //console.log(`---------`)
        const evaloutputembed = new MessageEmbed()
        .setTitle('Evaluated Code')
        .setDescription(`
        :inbox_tray: **Code**
        \`\`\`${args.codetoeval}\`\`\`
        
        :outbox_tray: **Output**
        \`\`\`${newoutput}\`\`\`
        `)

        message.channel.send(evaloutputembed)

    }
}

import { exec } from 'child_process';
import { Command } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { promisify } from 'util';
import { inspect } from 'util';
import utils from '../../functions/utils'

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
                },
                {
                    id: 'sudo',
                    match: 'flag',
                    flag: '--sudo'
                }
            ],
            ownerOnly: true,
            channel: 'guild'
        });
    }

    async exec(message, args) {
        try {

            // if (args.codetoeval.includes("client.token")) {
            //     return message.channel.send(`I see that you have tried to run code that (probably) gets my token! I don't like people gaining full control over me, so I won't be evaluating that code.`)
            // }
            // if (args.codetoeval.includes(".env")) {
            //     return message.channel.send(`I see that you have tried to run code that (probably) gets my token! I don't like people gaining full control over me, so I won't be evaluating that code.`)
            // }

            if (args.codetoeval.includes(`message.channel.delete`)) {
                return message.channel.send(`Are you IRONM00N?`)
            }
            if(args.codetoeval.includes(`message.guild.delete`)) {
                return message.channel.send(`You're like IRONM00N but infinitely more stupid!`)
            }
            if (args.codetoeval.includes(`delete`) && !args.sudo) {
                return message.channel.send(`This would be blocked by smooth brain protection, but BushBot has a license`)
            }

            let output = await eval(args.codetoeval)

            const tokencheck = inspect(output)

            if (tokencheck?.includes(this.client.token)) {
                await message.channel.send(`Resetting token.`)
                return utils.resetToken(message)
            }

            if (!args.silent && !args.codetoeval.includes("message.channel.delete()")) {
                const evaloutputembed = new MessageEmbed()
                    .setTitle('Evaluated Code')
                    .addField(`:inbox_tray: **Input**`, `\`\`\`js\n${args.codetoeval}\`\`\``)

                if (inspect(output, {depth: 0}).length > 1000) {
                    await evaloutputembed.addField(`:outbox_tray: **Output**`, await utils.haste(inspect(output)))
                }
                else {
                    evaloutputembed.addField(`:outbox_tray: **Output**`, `\`\`\`js\n${inspect(output, {depth: 0})}\`\`\``)
                }

                await message.channel.send(evaloutputembed)
            }
        }
        catch (err) {
            try {utils.errorhandling(err, message)}
            catch (err) {
                utils.errorchannelsend(err)
            }
            
        }
    }
}

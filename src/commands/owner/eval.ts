import { exec } from 'child_process';
import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { promisify } from 'util';
import { inspect } from 'util';
import { BotCommand } from '../../extensions/BotCommand';
import utils from '../../functions/utils'

const sh = promisify(exec);

export default class evaluate extends BotCommand {
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
            if (args.codetoeval.includes(`token`)) {
                return (message.channel.send(`no token`))
            }
            if (args.codetoeval.includes(`env`)) {
                return message.channel.send(`no env`)
            }
            
            if (args.codetoeval.includes(`message.channel.delete`)) {
                return message.channel.send(`Are you IRONM00N?`)
            }
            if (args.codetoeval.includes(`message.guild.delete`)) {
                return message.channel.send(`You're like IRONM00N but infinitely more stupid!`)
            }
            if (args.codetoeval.includes(`delete`) && !args.sudo) {
                return message.channel.send(`This would be blocked by smooth brain protection, but BushBot has a license`)
            }

            let output = await eval(args.codetoeval)

            const tokencheck = inspect(output)

            if (inspect(output).includes(process.env["token"])) {
                return message.channel.send(`Message containing token wasn't sent.`)
            }

            if (!args.silent && !args.codetoeval.includes("message.channel.delete()")) {
                const evaloutputembed = new MessageEmbed()
                    .setTitle('Evaluated Code')
                    .addField(`:inbox_tray: **Input**`, `\`\`\`js\n${args.codetoeval}\`\`\``)

                if (inspect(output, { depth: 0 }).length > 1000) {
                    await evaloutputembed.addField(`:outbox_tray: **Output**`, await utils.haste(inspect(output)))
                }
                else {
                    evaloutputembed.addField(`:outbox_tray: **Output**`, `\`\`\`js\n${inspect(output, { depth: 0 })}\`\`\``)
                }

                await message.channel.send(evaloutputembed)
            }
            if (args.silent) {
                if (args.codetoeval.includes('message.delete')) {
                    return
                }
                message.react(`<:success:838816341007269908>`)
            }
        }
        catch (err) {
            try { utils.errorhandling(err, message) }
            catch (err) {
                utils.errorchannelsend(err)
            }

        }
    }
}

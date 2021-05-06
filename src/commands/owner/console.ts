import { exec } from 'child_process';
import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { promisify } from 'util';
import { inspect } from 'util';
import { BotCommand } from '../../extensions/BotCommand';
import functions from '../../functions/utils'

const sh = promisify(exec);

export default class console extends BotCommand {
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
        try {
            let output = await eval(`sh('${args.command}')`)

            let outputembed = new MessageEmbed()
                .setTitle(`Console Command Ran`)
                .addField(`:inbox_tray: Command`, `\`\`\`${args.command}\`\`\``)

            if (inspect(output).length > 1000) {
                await outputembed.addField(`:outbox_tray: **Output**`, await functions.haste(inspect(output)))
            }
            else {
                outputembed.addField(`:outbox_tray: **Output**`, `\`\`\`js\n${inspect(output)}\`\`\``)
            }

            message.channel.send(outputembed)
        }

        catch (err) {
            functions.errorhandling(err, message)
        }
    }
}

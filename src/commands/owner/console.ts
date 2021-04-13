import { exec } from 'child_process';
import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { promisify } from 'util';
import { inspect } from 'util';


const sh = promisify(exec);

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
            outputembed.addField(`:outbox_tray: Output`, `\`\`\`js\n${inspect(output)}\`\`\``)

        message.channel.send(outputembed)

    }
}

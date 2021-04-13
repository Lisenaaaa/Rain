import { exec } from 'child_process';
import { Command } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { promisify } from 'util';
import { inspect } from 'util';

const sh = promisify(exec);

export default class gitpush extends Command {
    constructor() {
        super('gitpush', {
            aliases: ['gitpush', 'push'],
            args: [
                {
                    id: 'commitReason',
                    type: 'string',
                    match: 'restContent'
                },
            ],
            ownerOnly: true,
            channel: 'guild'
        });
    }

    async exec(message, args) {

        eval(`sh('git add .')`)
        eval(`sh('git commit -m "${args.commitReason}"')`)
        eval(`sh('git push')`)

        message.channel.send(`Your changes have (hopefully) been pushed to GitHub!`)

    }
}

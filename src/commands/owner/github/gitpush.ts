import { exec } from 'child_process';
import { Command } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { promisify } from 'util';
import { inspect } from 'util';
import { BotCommand } from '../../../extensions/BotCommand';

const sh = promisify(exec);

export default class gitpush extends BotCommand {
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
        if (args.commitReason.length > 50) {
            return message.channel.send(`Your commit message is too long!`)
        }

        const hiyesthisisanembed = new MessageEmbed()
            .setDescription(`Pushing changes to [GitHub](https://github.com/Zordlan/SkyClientBot)`)
        message.channel.send(hiyesthisisanembed)

        const githubembed = new MessageEmbed()
            .setTitle(`Command Output`)

        let gitadd = await eval(`sh('git add .')`)
        githubembed.addField(`\`git add .\``, `\`\`\`js\n${inspect(gitadd)}\`\`\``)

        let gitcommit = await eval(`sh('git commit -m "${args.commitReason}"')`)
        githubembed.addField(`\`git commit "${args.commitReason}"\``, `\`\`\`js\n${inspect(gitcommit)}\`\`\``)

        let githubpush = await eval(`sh('git push')`)
        githubembed.addField(`\`git push\``, `\`\`\`js\n${inspect(githubpush)}\`\`\``)

        message.channel.send(githubembed)

    }
}

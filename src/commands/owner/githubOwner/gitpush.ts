import { exec } from 'child_process';
import { MessageEmbed } from 'discord.js';
import { promisify } from 'util';
import { inspect } from 'util';
import { BotCommand } from '@extensions/BotCommand';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            return message.util.send(`Your commit message is too long!`)
        }

        const hiyesthisisanembed = new MessageEmbed()
            .setDescription(`Pushing changes to [GitHub](https://github.com/Zordlan/SkyClientBot)`)
        message.util.send({ embeds: [hiyesthisisanembed] })

        const githubembed = new MessageEmbed()
            .setTitle(`Command Output`)

        const gitadd = await sh('git add .')
        githubembed.addField(`\`git add .\``, `\`\`\`js\n${inspect(gitadd)}\`\`\``)

        const gitcommit = await sh('git commit -m "${args.commitReason}"')
        githubembed.addField(`\`git commit "${args.commitReason}"\``, `\`\`\`js\n${inspect(gitcommit)}\`\`\``)

        const githubpush = await sh('git push')
        githubembed.addField(`\`git push\``, `\`\`\`js\n${inspect(githubpush)}\`\`\``)

        message.util.reply({ embeds: [githubembed] })

    }
}

import { exec } from 'child_process';
import { MessageEmbed } from 'discord.js';
import { inspect, promisify } from 'util';
import { BotCommand } from '@extensions/BotCommand';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sh = promisify(exec);

export default class gitpull extends BotCommand {
    constructor() {
        super('gitpull', {
            aliases: ['gitpull', 'pull'],
            ownerOnly: true,
            channel: 'guild'
        });
    }

    async exec(message) {
        const githubembed = new MessageEmbed()
        
        const pull = sh('git pull')
        githubembed.setDescription(`\`\`\`js\n${inspect(pull)}\`\`\``)

        message.util.reply(githubembed)

    }
}

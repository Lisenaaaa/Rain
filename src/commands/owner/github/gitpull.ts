import { exec } from 'child_process';
import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { inspect, promisify } from 'util';
import { BotCommand } from '../../../extensions/BotCommand';

const sh = promisify(exec);

export default class gitpull extends BotCommand {
    constructor() {
        super('gitpull', {
            aliases: ['gitpull', 'pull'],
            ownerOnly: true,
            channel: 'guild'
        });
    }

    async exec(message, args) {
        const githubembed = new MessageEmbed()
        
        let pull = await eval(`sh('git pull')`)
        githubembed.setDescription(`\`\`\`js\n${inspect(pull)}\`\`\``)

        message.channel.send(githubembed)

    }
}

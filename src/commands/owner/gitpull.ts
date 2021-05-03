import { exec } from 'child_process';
import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { promisify } from 'util';

const sh = promisify(exec);

export default class gitpull extends Command {
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
        githubembed.setDescription(`\`\`\`js\n${pull}\`\`\``)

        message.channel.send(githubembed)

    }
}

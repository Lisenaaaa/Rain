import { Command } from 'discord-akairo';

export default class templateSkyclientCommand extends Command {
    constructor() {
        super('templateSkyclientCommand', {
            aliases: ['templateSkyclientCommand'],
            channel: 'guild'
        });
    }

    async exec(message) {
        const SkyClientGuilds = [
            `780181693100982273`, //main server
            `824680357936103497` //testing server
        ]
        if (message.guild.id == SkyClientGuilds) { message.channel.send(`This is a SkyClient server!`) }
        else {
            message.channel.send(`e`)
        }
    }
}

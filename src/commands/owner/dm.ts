import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';

export default class dm extends Command {
    constructor() {
        super('dm', {
            aliases: ['dm'],
            args: [
                {
                    id: 'member',
                    type: 'member'
                },
                {
                    id: 'message',
                    type: 'string',
                    match: 'restContent'
                },
            ],
            ownerOnly: true,
            channel: 'guild'
        });
    }

    async exec(message, args) {

        args.member.send(`${args.message}`)
        .then(message.channel.send(`Message sent!`))
        .catch(`Something went wrong!`)
        
        const dmembed = new MessageEmbed()
        .setTitle(`Message was sent to **${args.member.user.tag}**`)
        .addField(`Contents`, `${args.message}`)
        .setTimestamp
        

    }
}

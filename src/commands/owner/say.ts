import { Command } from 'discord-akairo';

export default class say extends Command {
    constructor() {
        super('say', {
            aliases: ['say'],
            args: [
                {
                    id: 'say',
                    type: 'string',
                    match: 'text',

                },
                {
                    id: 'channel',
                    match: 'option',
                    flag: '--channel',
                    unordered: true,
                    type: 'channel'
                },
            ],
            channel: 'guild'
        });
    }

    async exec(message, args) {

        if (args.channel) {
            args.channel.send(args.say)
            message.channel.send(`Message sent!`)
            console.log(`Message ${args.say} was sent in ${message.channel.name} on ${message.guild.name} by ${message.author.tag}`)
        }
        else {
            message.channel.send(args.say)
            if (message.deletable) {
                await message.delete()
            }
            console.log(`Message ${args.say} was sent in ${message.channel.name} on ${message.guild.name} by ${message.author.tag}`)
        }
    }
}

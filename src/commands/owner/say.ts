import { Command } from 'discord-akairo';
import { BotCommand } from '../../extensions/BotCommand';

export default class say extends BotCommand {
    constructor() {
        super('say', {
            aliases: ["say", "talk"],
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
                    //unordered: true,
                    type: 'channel'
                },
                {
                    id: "delete",
                    match: 'flag',
                    flag: '--delete',
                    //unordered: true,
                    //type: 'bool'
                }
            ],
            channel: 'guild',
            ownerOnly: true
        });
    }

    async exec(message, args) {

        if (!args.say) {
            return message.channel.send(`I can't say nothing!`)
        }

        if (args.channel) {
            args.channel.send(args.say)
            message.channel.send(`Message sent!`)
            //console.log(`Message ${args.say} was sent in #${message.channel.name} on ${message.guild.name} by ${message.author.tag}`)
        }

        else {
            message.channel.send(args.say)
            if (message.deletable && args.delete) {
                await message.delete()
                //console.log(`Message ${args.say} was sent in #${message.channel.name} on ${message.guild.name} by ${message.author.tag}`)
            }
            //console.log(`Message ${args.say} was sent in #${message.channel.name} on ${message.guild.name} by ${message.author.tag}`)
        }
    }
}

import { Command } from 'discord-akairo';

export default class dm extends Command {
    constructor() {
        super('dm', {
            aliases: ['dm', "dn"],
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
            channel: 'guild'
        });
    }

    async exec(message, args) {

        args.member.send(`${args.message}`);
        message.channel.send(`Message \n${args.message}\n was sent to ${args.member}!`)

    }
}

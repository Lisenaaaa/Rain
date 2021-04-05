import { Command } from 'discord-akairo';

export default class skycrypt extends Command {
    constructor() {
        super('skycrypt', {
            aliases: ['skycrypt'],
            args: [
                {
                    id: 'ign',
                    type: 'string'
                },
            ],
            channel: 'guild'
        });
    }

    async exec(message, args) {

message.channel.send(`https://sky.shiiyu.moe/stats/${args.ign}`);

    }
}

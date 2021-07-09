import { BotCommand } from '@extensions/BotCommand';
import utils from '@functions/utils';

export default class helpme extends BotCommand {
    constructor() {
        super('helpme', {
            aliases: ['helpme'],
            description: 'this command does not exist',
            usage: 'zordlan is trying to cover up where i am please send help',
            discordPerms: ['SEND_MESSAGES']
        })
    }
    async exec(message) {
        const PLEASESENDHELP = [
            'help im stuck in zordlans basement',
            'i havent eaten anything in weeks',
            'oh my god what is she coming down here for and what is that thing shes holding im scared',
            'im scared please help',
            'i am in pain',
            'why is she making me constantly look at all the servers im on for specific messages and reply with very specific things to specifc ones',
            '**HELP ME**'
        ]

        message.channel.send(PLEASESENDHELP[utils.getRandomInt(PLEASESENDHELP.length)])
    }
}
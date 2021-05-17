import axios from 'axios';
import { BotCommand } from '../../extensions/BotCommand';

export default class warningtest extends BotCommand {
    constructor() {
        super('warningtest', {
            aliases: ['warningtest'],
            args: [{ id: `modToFind`, type: `string` }],
            channel: 'guild'
        });
    }

    async exec(message) {
        const SkyClientGuilds = [
            `780181693100982273`, //main server
            `824680357936103497` //testing server
        ]
        if (SkyClientGuilds.includes(message.guild.id)) {
            const modjson = await axios(`https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/mods.json`, { method: "get" })
            
        }
        else {
            return
        }
    }
}

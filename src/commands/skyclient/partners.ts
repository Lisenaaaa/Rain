import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import axios from "axios"
import utils from '../../functions/utils';

export default class partners extends Command {
    constructor() {
        super('partners', {
            aliases: ['partners'],
            userPermissions: ['ADMINISTRATOR'],
        });
    }

    async exec(message) {

        const res = await axios(`https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/discords.json`, { method: "get" })

        for (const element of res.data) {
            await utils.sleep(500)
            if (element.fancyname) {
                await message.channel.send(element.fancyname)
            }
            //await console.log(element.fancyname)
        }
    }
}
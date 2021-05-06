import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import axios from "axios"
import utils from '../../../functions/utils';
import { BotCommand } from '../../../extensions/BotCommand';

export default class packlist extends BotCommand {
    constructor() {
        super('packlist', {
            aliases: ['packlist', 'packs'],
            args: [
                {
                    id: "packname",
                    type: "string"
                }
            ]
        });
    }

    async exec(message, args) {
        const SkyClientGuilds = [
            `780181693100982273`, //main server
            `824680357936103497` //testing server
        ]
        if (SkyClientGuilds.includes(message.guild.id)) {
            const packjson = await axios(`https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/packs.json`, { method: "get" })
            //const creatorsjson = await axios(/*url goes here*/``, { method: "get" })

            const packsEmbed = new MessageEmbed()
                .setColor('#9c25c4')
                .setTitle('SkyClient packs List')

            packjson.data.forEach(pack => {
                if (pack.display && pack.display != "no" && pack.hidden != true) {
                    let packs = ""

                    if (pack.display.includes("Bundle")) {
                        pack.actions.forEach(bundle => {

                            if (bundle.text && bundle.text != "Guide") {
                                packs = packs + bundle.text + ", "
                            }
                        });
                        packs = packs.substring(0, packs.length - 2)
                    }
                    else {
                        if (pack.display && pack.creator && pack.display != "no" && pack.discordcode) {
                            packs = `Creator: [${pack.creator}](https://discord.gg/${pack.discordcode})\npack ID: \`${pack.id}\``
                        }
                        else {
                            packs = `Creator: ${pack.creator}\npack ID: \`${pack.id}\``
                        }
                    }

                    packsEmbed.addField(`${pack.display}`, packs, true)

                }
            });
            message.channel.send(packsEmbed);
        }
        else {return}
    }
}
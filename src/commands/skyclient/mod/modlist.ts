import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import axios from "axios"
import utils from '../../../functions/utils';

export default class modlist extends Command {
    constructor() {
        super('modlist', {
            aliases: ['modlist', 'mods'],
            args: [
                {
                    id: "modname",
                    type: "string"
                }
            ]
        });
    }

    async exec(message, args) {
        if (message.guild.id != `824680357936103497` || `780181693100982273`) { return }
        else {

            const modjson = await axios(`https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/mods.json`, { method: "get" })
            //const creatorsjson = await axios(/*url goes here*/``, { method: "get" })

            const modsEmbed = new MessageEmbed()
                .setColor('#9c25c4')
                .setTitle('SkyClient Mods List')

            modjson.data.forEach(mod => {
                if (mod.display && mod.display != "no" && mod.hidden != true) {
                    let mods = ""

                    if (mod.display.includes("Bundle")) {
                        mod.actions.forEach(bundle => {

                            if (bundle.text && bundle.text != "Guide") {
                                mods = mods + bundle.text + ", "
                            }
                        });
                        mods = mods.substring(0, mods.length - 2)
                    }
                    else {
                        if (mod.display && mod.creator && mod.display != "no" && mod.discordcode) {
                            mods = `Creator: [${mod.creator}](https://discord.gg/${mod.discordcode})\nMod ID: \`${mod.id}\``
                        }
                        else {
                            mods = `Creator: ${mod.creator}\nMod ID: \`${mod.id}\``
                        }
                    }

                    modsEmbed.addField(`${mod.display}`, mods, true)

                }
            });
            message.channel.send(modsEmbed);
        }
    }
}
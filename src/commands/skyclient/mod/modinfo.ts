import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import axios from "axios"
import utils from '../../../functions/utils';

export default class modinfo extends Command {
    constructor() {
        super('modinfo', {
            aliases: ['modinfo', 'mod'],
            args: [
                {
                    id: "modname",
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
            const modjson = await axios(`https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/mods.json`, { method: "get" })
            //const creatorsjson = await axios(/*url goes here*/``, { method: "get" })

            for (const mod of modjson.data) {
                if (mod.id == args.modname) {
                    const modEmbed = new MessageEmbed()
                        .setTitle(mod.display)
                        .setColor('#9c25c4')
                    if (mod.discordcode) {
                        modEmbed.setURL(`https://discord.gg/${mod.discordcode}`)
                    }
                    modEmbed.addFields(
                        { name: 'Description', value: mod.description },
                        //{ name: 'Main Command', value: `\`${mod.command}\`` },
                        { name: 'Direct Download', value: `[Click Here](${mod.url})!` },
                    )
                    if (mod.command) {
                        modEmbed.addField(`Main Command`, `\`${mod.command}\``)
                    }

                    let icon = mod.icon
                    icon = icon.replace(/ /g, '%20')

                    modEmbed.setThumbnail(`https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/icons/${icon}`)
                    if (mod.creator) {
                        modEmbed.setFooter(`Created by ${mod.creator}`)
                    }

                    message.channel.send(modEmbed)
                }

            }
        }
        else { return }
    }
}
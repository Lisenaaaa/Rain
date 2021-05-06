import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import axios from "axios"
import utils from '../../../functions/utils';
import { BotCommand } from '../../../extensions/BotCommand';

export default class packinfo extends BotCommand {
    constructor() {
        super('packinfo', {
            aliases: ['packinfo', 'pack'],
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

            for (const pack of packjson.data) {
                if (pack.id == args.packname) {
                    const packEmbed = new MessageEmbed()
                        .setTitle(pack.display)
                        .setColor('#9c25c4')
                    if (pack.discordcode) {
                        packEmbed.setURL(`https://discord.gg/${pack.discordcode}`)
                    }

                    let filteredPackFileName = pack.file.replace(/ /g, '%20')
                    let packDownloadURL = `https://github.com/nacrt/SkyblockClient-REPO/blob/main/files/packs/${filteredPackFileName}?raw=true`
                    packEmbed.addFields(
                        { name: 'Description', value: pack.description },
                        { name: 'Direct Download', value: `[Click Here](${packDownloadURL})!` },
                    )
                    if (pack.command) {
                        packEmbed.addField(`Main Command`, `\`${pack.command}\``)
                    }

                    let icon = pack.icon
                    icon = icon.replace(/ /g, '%20')

                    packEmbed.setThumbnail(`https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/icons/${icon}`)
                    if (pack.creator) {
                        packEmbed.setFooter(`Created by ${pack.creator}`)
                    }

                    message.channel.send(packEmbed)
                }
            }
        }
        else {return}


    }
}
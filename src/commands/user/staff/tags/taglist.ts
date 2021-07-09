import { MessageEmbed } from "discord.js";
import { BotCommand } from "@extensions/BotCommand";
import language from "../../../../constants/language";
import db from "@functions/database";

export default class taglist extends BotCommand {
    constructor() {
        super("taglist", {
            aliases: ["taglist", "tags"],
            description: 'This is an example command!',
            usage: '-templateCommand',
            discordPerms: ['SEND_MESSAGES']

        });
    }

    async exec(message) {
        await db.read(message.guild.id).then(data => {
            let taglist = ``
            let tagsEmbed = new MessageEmbed()

            data[0].tags.forEach(tag => {
                taglist = taglist + `${tag.name}, `
            })

            taglist = taglist.substring(0, taglist.length - 2)

            tagsEmbed.setTitle(`${message.guild.name}'s tags`)

            if (taglist.length === 0) {
                taglist = language.noTags
            }
            tagsEmbed.setDescription(taglist)

            message.util.send(tagsEmbed)
        })
    }
}
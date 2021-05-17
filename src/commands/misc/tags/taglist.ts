import { MessageEmbed } from "discord.js";
import { BotCommand } from "../../../extensions/BotCommand";
import db from "../../../functions/database";

export default class taglist extends BotCommand {
    constructor() {
        super("taglist", {
            aliases: ["taglist", "tags"]
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
                    taglist = `You don't have any tags! Use \`-tag create <tagName> <tagResponse>\` to make a new one!`
                }
                tagsEmbed.setDescription(taglist)

                message.channel.send(tagsEmbed)
        })
    }
}
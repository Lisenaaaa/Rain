import { MessageEmbed } from "discord.js";
import { BotCommand } from "@extensions/BotCommand";
import database from "@functions/database";
import utils from "@functions/utils";

export default class tags extends BotCommand {
    constructor() {
        super("tags", {
            aliases: ["tag"],
            args: [
                { id: `action`, type: `string` },
                { id: `tagName`, type: `string`, },
                { id: `tagContent`, type: `string`, match: `restContent` }
            ],
            description: 'Tags! If you don\'t know what they are, they\'re basically custom text responses.',
            usage: 'To create tags: `-tag create <tagName> <tagResponse>`\nTo edit tags: `-tag edit <tagName> <newTagResponse>`\nTo delete tags: `-tag delete <tagName>`\nTo view tags: `-tag <tagName>`',
            discordPerms: ['MANAGE_MESSAGES']

        })
    }

    async exec(message, args) {

        try {
            let addTriggers = [
                "add",
                "create",
                "make"
            ]
            let editTriggers = [
                "edit",
                "update"
            ]
            let removeTriggers = [
                "remove",
                "delete"
            ]

            addTriggers.forEach(thing => {
                if (args.action == thing) {
                    //check if tag name is one of the above triggers
                    if (addTriggers.includes(args.tagName)) { return message.util.send(`You can't create a tag with that name!`) }
                    if (editTriggers.includes(args.tagName)) { return message.util.send(`You can't create a tag with that name!`) }
                    if (removeTriggers.includes(args.tagName)) { return message.util.send(`You can't create a tag with that name!`) }

                    if (!args.tagContent) { return message.util.send(`You can't create a tag with no response!`) }

                    database.addTag(message.guild.id, args.tagName, args.tagContent).then(e => {
                        if (e.result.ok == 1) {
                            const successEmbed = new MessageEmbed()
                                .setDescription(`Tag \`${args.tagName}\` successfully created!`)

                            message.util.send(successEmbed)
                        }
                    })
                }
            })

            editTriggers.forEach(thing => {
                if (args.action == thing) {
                    database.editTag(message.guild.id, args.tagName, args.tagContent).then(e => {
                        if (e.result.ok == 1) {
                            message.react(`<:success:838816341007269908>`)
                        }
                    })
                }
            })

            removeTriggers.forEach(thing => {
                if (args.action == thing) {
                    database.deleteTag(message.guild.id, args.tagName).then(e => {
                        if (e.result.ok == 1) {
                            message.util.send(`Tag \`${args.tagName}\` successfully deleted!`)
                        }
                    })
                }
            })

            await database.readGuild(message.guild.id).then(guildDB => {
                const tags = guildDB[0].tags
                tags.forEach(tag => {
                    if (message.content == `${this.prefix}tag ${tag.name}` && message.author.bot == false) { message.util.send(tag.value) }
                })
            })
        }
        catch (err) {
            if (err == `TypeError: Cannot read property 'id' of null`) { return }
        }
    }
}
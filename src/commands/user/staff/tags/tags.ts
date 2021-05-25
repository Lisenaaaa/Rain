import { MessageEmbed } from "discord.js";
import language from "../../../../constants/language";
import { BotCommand } from "../../../../extensions/BotCommand";
import db from "../../../../functions/database";

export default class tagCommand extends BotCommand {
    constructor() {
        super("tagCommand", {
            aliases: ["tag"],
            args: [
                { id: `action`, type: `string` },
                { id: `tagName`, type: `string`, },
                { id: `tagContent`, type: `string`, match: `restContent` }
            ],
            userPermissions: ['MANAGE_MESSAGES'],
        });
    }

    async exec(message, args) {

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
                for (let trigger of addTriggers) { if (args.tagName == trigger) { return message.channel.send(language.badTagName) } }
                for (let trigger of editTriggers) { if (args.tagName == trigger) { return message.channel.send(language.badTagName) } }
                for (let trigger of removeTriggers) { if (args.tagName == trigger) { return message.channel.send(language.badTagName) } }

                if (!args.tagContent) { return message.channel.send(language.tagNoResponse) }

                db.addTag(message.guild.id, args.tagName, args.tagContent).then(e => {
                    if (e.result.ok == 1) {
                        const successEmbed = new MessageEmbed()
                            .setDescription(`Tag \`${args.tagName}\` succesfully created!`)

                        message.channel.send(successEmbed)
                    }
                })
            }
        })

        editTriggers.forEach(thing => {
            if (args.action == thing) {
                db.editTag(message.guild.id, args.tagName, args.tagContent).then(e => {
                    if (e.result.ok == 1) {
                        message.react(`<:success:838816341007269908>`)
                    }
                })
            }
        })

        removeTriggers.forEach(thing => {
            if (args.action == thing) {
                db.deleteTag(message.guild.id, args.tagName).then(e => {
                    if (e.result.ok == 1) {
                        message.channel.send(`Tag \`${args.tagName}\` succesfully deleted!`)
                    }
                })
            }
        })
    }
}
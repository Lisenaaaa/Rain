import { MessageEmbed } from "discord.js"
import { BotCommand } from '@extensions/BotCommand'
import utils from "@functions/utils"
import commandManager from "@functions/commandManager"

export default class pronouns extends BotCommand {
    constructor() {
        super('pronouns', {
            aliases: ['pronouns'],
            args: [{ id: 'person', type: 'user', match: 'rest', default: message => message.author }],

            description: 'Shows the pronouns of a user, if they have them set on https://pronoundb.org',
            usage: '-pronouns <user>',
            discordPerms: ['SEND_MESSAGES']
        })
    }
    async exec(message, args) {
        if (!commandManager.checkIfCommandCanBeUsed(message, this.id)) { return }

        const pronouns = await utils.getPronouns(args.person, 'details')
        const pronounsEmbed = new MessageEmbed()

        if (args.person.id == message.author.id) { pronounsEmbed.setTitle('Your pronouns') }
        else { pronounsEmbed.setTitle(`${args.person.username}'s pronouns`) }

        pronounsEmbed.setDescription(pronouns)
        pronounsEmbed.setFooter('Data from https://pronoundb.org')

        message.reply({ embeds: [pronounsEmbed] })
    }
}
import { MessageEmbed } from "discord.js";
import { BotListener } from "@extensions/BotListener";

export default class missingPermissions extends BotListener {
    constructor() {
        super('missingPermissions', {
            emitter: 'commandHandler',
            event: 'missingPermissions'
        })
    }

    exec(message, command, type) {
        const PermsErrorEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Something went wrong!')

        if (type == 'user') {
            const perm = command.userPermissions[0]
            PermsErrorEmbed.setDescription(`You cannot run this command, as you don't have \`${perm}\`.`)
        } else {
            const perm = command.clientPermissions[0]
            PermsErrorEmbed.setDescription(`I don't have \`${perm}\`, which I need to have to run this command.`)
        }
        message.util.send(PermsErrorEmbed)

    }
}
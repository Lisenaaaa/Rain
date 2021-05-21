import { TextChannel } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { BotListener } from '../../extensions/BotListener';
import db from '../../functions/database';

class supportServerEditMessageLogging extends BotListener {
    constructor() {
        super('supportServerEditMessageLogging', {
            emitter: 'client',
            event: 'messageUpdate'
        });
    }

    async exec(oldMessage, newMessage) {
        if (newMessage.guild.id == `824680357936103497`) {
            let messageLoggingChannel = newMessage.guild.channels.cache.get('844252162048655430') as TextChannel
            let editEmbed = new MessageEmbed()

            editEmbed.setTitle(`Message Edited`)
            editEmbed.setDescription(`${newMessage.author.tag} edited a message in ${newMessage.channel}`)
            editEmbed.addField(`Old Message Content`, oldMessage.content)
            editEmbed.addField(`New Message Content`, newMessage.content)

            //console.log(newMessage)

            messageLoggingChannel.send(editEmbed)
        }
    }
}

module.exports = supportServerEditMessageLogging;
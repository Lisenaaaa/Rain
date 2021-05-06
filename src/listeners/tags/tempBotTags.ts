import axios from 'axios';
import { Listener } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';

class temporaryTags extends Listener {
    constructor() {
        super('temporaryTags', {
            emitter: 'client',
            event: 'message'
        });
    }

    async exec(message) {
        const tagsjson = await axios(`https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/bottags.json`, { method: "get" })

        const tagsEmbed = new MessageEmbed()
            .setTitle(`Tags`)

        for (const tag of tagsjson.data) {
            if (message.content === `-${tag.trigger}`) {
                message.channel.send(tag.response)
            }
            
        }
        if (message.content === `-tags`) {
            for (const tag of tagsjson.data) {
                tagsEmbed.addField(`-${tag.trigger}`, tag.taginfo, true)
            }
            message.channel.send(tagsEmbed)
        }
    }
}

module.exports = temporaryTags;
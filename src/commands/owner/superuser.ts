import { MessageEmbed } from 'discord.js';
import { BotCommand } from '../../extensions/BotCommand';

const jsonfile = require('jsonfile')
const file = 'config/global/superusers.json'

export default class superuser extends BotCommand {
    constructor() {
        super('superuser', {
            aliases: ['superuser'],
            args: [
                {
                    id: 'member',
                    type: 'member'
                }
            ],
            ownerOnly: true,
            channel: 'guild'
        });
    }

    async exec(message, args) {

        jsonfile.readFile(file)
            .then(superuserfile => {

                const superembed = new MessageEmbed()
                .setColor("#9c25c4")

                if (superuserfile.superusers.includes(args.member.id)) {
                    superuserfile.superusers = superuserfile.superusers.filter(id => id != args.member.id)
                    jsonfile.writeFile(file, superuserfile)
                    superembed.setDescription(`${args.member} is no longer a superuser.`)
                    message.channel.send(superembed)
                }

                else {
                    superuserfile.superusers.push(args.member.id)
                    jsonfile.writeFile(file, superuserfile)
                    superembed.setDescription(`${args.member} is now a superuser.`)
                    message.channel.send(superembed)
                }
            })
            .catch(error => console.log(error))
    }
}

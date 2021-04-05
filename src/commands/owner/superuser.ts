import { Command } from 'discord-akairo';

const jsonfile = require('jsonfile')
const file = 'src/config/global/superusers.json'

export default class superuser extends Command {
    constructor() {
        super('superuser', {
            aliases: ['superuser'],
            args: [
                {
                    id: 'member',
                    type: 'member'
                }
            ],
            channel: 'guild'
        });
    }

    async exec(message, args) {

        jsonfile.readFile(file)
            .then(superuserfile => {

                if (superuserfile.superusers.includes(args.member.id)) {
                    message.channel.send("that member is already a superuser, so i did nothing")
                }

                // else if (they're already in the file) {
                //     remove them from the file
                // }

                else {
                    superuserfile.superusers.push(args.member.id)
                    jsonfile.writeFile(file, superuserfile)
                    message.channel.send(`${args.member} is now a superuser.`)
                }

                console.log(superuserfile)
            })
            .catch(error => console.log(error))
    }
}

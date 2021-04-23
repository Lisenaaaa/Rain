import { Command } from 'discord-akairo';
import { User } from 'discord.js';

export default class addrole extends Command {
    constructor() {
        super('addrole', {
            aliases: ['addrole'],
            args: [
                {
                    id: 'member',
                    type: 'member'
                },
                {
                    id: 'role',
                    type: 'role'
                }
            ],
            ownerOnly: true,
            channel: 'guild'
        });
    }

    async exec(message, args) {
        try{
        args.member.roles.add(args.role)
        message.channel.send(`Added role ${args.role.name} to ${args.member.user.tag}`)
        }
        catch(err) {
            message.channel.send(err.message)
        }
        
    }
}

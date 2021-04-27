import { Command } from 'discord-akairo';
import moderation from '../../../functions/moderation'
import utils from '../../../functions/utils';

export default class BanCommand extends Command {

    constructor() {
        super('ban', {
            aliases: ['ban', 'leaveservernow', 'banish', 'byebye', 'murder', 'assassinate'],
            args: [
                {
                    id: 'member',
                    type: 'member'
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'restContent',
                    default: 'No reason given.'
                }
            ],
            clientPermissions: ['BAN_MEMBERS', 'EMBED_LINKS'],
            userPermissions: ['BAN_MEMBERS'],
            channel: 'guild'
        });
    }

    async exec(message, args) {
        let reason
        
        if (args.reason.length > 900) {
            reason = utils.haste(args.reason)
        }
        else {
            reason = args.reason
        }

        moderation.ban(args.member, reason, message.author, message)

    }
}

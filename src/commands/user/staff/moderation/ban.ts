import language from "../../../../constants/language";
import { BotCommand } from "../../../../extensions/BotCommand";
import utils from "../../../../functions/utils";

export default class ban extends BotCommand {
    constructor() {
        super("ban", {
            aliases: ["ban"],
            args: [
                { id: `member`, type: `member` },
                { id: `reason`, type: `string`, match: `restContent` },
            ],
            userPermissions: ['BAN_MEMBERS'],
            description: {
                description: 'This is an example command!',
                usage: '`-ban <member> <reason>`',
                defaultPerms: 'BAN_MEMBERS'
            }
        });
    }

    async exec(message, args) {
        //check if bannable
        if (args.member.user.id == message.guild.owner.id) { return utils.errorhandling(`You can't ban the owner of the server!`, message) }
        if (args.member.user.id == message.author.id) { return utils.errorhandling(`You can't ban yourself!`, message) }
        if (args.member.user.id == this.client.user.id) { return utils.errorhandling(`Why would you want to ban me?`, message) }

        //check for perms
        if (await utils.getRolePriority(message.member, args.member) == false) {
            return message.channel.send(`Your highest role is lower than (or the same as) ${args.member.user.username}'s highest role, so you cannot ban ${await utils.getPronouns(args.member.user, 'describe')}.`)
        }

        message.delete()
        args.member.user.send(`You have been banned from **${message.guild.name}** for \`${args.reason}\`.`).then(() => {
            args.member.ban({ reason: `${message.author.tag} | ${args.reason}` })
        })
        message.util.send(`**${args.member.user.username}** has been banned.`)
    }
}
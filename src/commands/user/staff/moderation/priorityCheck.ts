import language from "../../../../constants/language";
import { BotCommand } from "../../../../extensions/BotCommand";

export default class rolePriorityCheck extends BotCommand {
    constructor() {
        super("rolePriorityCheck", {
            aliases: ["rolePriorityCheck"],
            args: [{ id: `member`, type: `member` },],
            userPermissions: ['KICK_MEMBERS'],
        });
    }

    async exec(message, args) {
        if (message.member.roles.highest.rawPosition > args.member.roles.highest.rawPosition) {
            message.channel.send(await language.rolePriorityHigher(args.member.user))
        }
        else if (message.member.roles.highest.rawPosition == args.member.roles.highest.rawPosition) {
            message.channel.send(await language.rolePrioritySame(args.member.user))
        }
        else {
            message.channel.send(await language.rolePriorityLower(args.member.user))
        }
    }
}
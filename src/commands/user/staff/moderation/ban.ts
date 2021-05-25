import { MessageEmbed } from "discord.js";
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
        });
    }

    async exec(message, args) {
        //check if bannable
        if (args.member.user.id == message.guild.owner.id) { return utils.errorhandling(`You can't ban the owner of the server!`, message) }
        if (args.member.user.id == message.author.id) { return utils.errorhandling(`You can't ban yourself!`, message) }
        if (args.member.user.id == this.client.user.id) { return utils.errorhandling(`Why would you want to ban me?`, message) }

        //check for perms
        //im lazy so im using other code, ik grammar doesnt really make sense here but shut
        if (args.member.roles.highest.rawPosition > message.member.roles.highest.rawPosition && message.author.id != message.guild.owner.id) { return message.channel.send(await language.rolePriorityHigher(args.member.user)) }
        if (message.member.roles.highest.rawPosition == args.member.roles.highest.rawPosition && message.author.id != message.guild.owner.id) { return message.channel.send(await language.rolePrioritySame(args.member.user)) }

        message.delete()
        await args.member.user.send(`You have been banned from **${message.guild.name}** for \`${args.reason}\`.`).then(e => {
            args.member.ban({ reason: `${message.author.tag} | ${args.reason}` })
        })
        message.channel.send(`${args.member.user.username} has been banned.`)
    }
}
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { GuildMember } from "discord.js";
import { User } from "discord.js";

async function ban (member: GuildMember, reason: String, author: User, message: Message) {
    const BanEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('A user has been permanently banned.')
        .setAuthor(author.tag)
        .setTimestamp()
        .addFields(
            { name: 'Banned User', value: member },
            { name: 'Ban Reason', value: reason }
        )

    const ErrorEmbed = new MessageEmbed()

    member.send(`You have been banned from ${message.guild.name} for ${reason}.`)
        .then(() => member.ban({ reason: `${message.author.tag} | ${reason}` }))
        .catch(() => {
            ErrorEmbed.setDescription(`I couldn\'t DM ${member.user}.`)
            message.channel.send(ErrorEmbed)

            member.ban({ reason: `${message.author.tag} | ${reason} ` })
        })
    message.channel.send(BanEmbed);
}

export = {
    ban
}
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { GuildMember } from "discord.js";
import { User } from "discord.js";

async function ban(member: GuildMember, reason: String, author: User, message: Message) {

    const ErrorEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Something went wrong!')

    if (!member) {
        ErrorEmbed.setDescription('No member found with that name.')
        return message.channel.send(ErrorEmbed)
    }

    if (member.user.id == message.author.id) {
        ErrorEmbed.setDescription(`You can't ban yourself!`)
        return message.channel.send(ErrorEmbed)
    }

    if (member.user.id == message.guild.ownerID) {
        ErrorEmbed.setDescription(`You can't ban the server's owner!`)
        return message.channel.send(ErrorEmbed)
    }

    if (member.user.id == `661018000736124948`) {
        return message.channel.send(`That won't work, and also even if Discord would let me ban myself, why would I?`)
    }

    // //cant ban zordlan
    // if (args.member == 492488074442309642) {
    //     return message.channel.send('no.')
    // }

    // //cant ban nacrt
    // if (args.member == 435443705055543306) {
    //     return message.channel.send('no.')
    // }

    if (member.bannable != true) {
        ErrorEmbed.setDescription('I can\'t ban that user. Most likely my highest role is under their highest role.')
        return message.channel.send(ErrorEmbed)
    }
    const BanEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('A user has been permanently banned.')
        .setAuthor(author.tag)
        .setTimestamp()
        .addField(`Banned User`, member)

    if (reason == `undefined`) {
        BanEmbed.addField(`Reason`, `No reason given.`)
        reason = `No reason given.`
    }
    else {
        BanEmbed.addField(`Reason`, reason)
    }

    //const ErrorEmbed = new MessageEmbed()

    if (reason == `No reason given.`) {
        member.send(`You have been banned from ${message.guild.name} without a reason.`)
        .then(() => member.ban({ reason: `${message.author.tag} | ${reason}` }))
        .catch(() => {
            ErrorEmbed.setDescription(`I couldn't DM ${member.user}.`)
            message.channel.send(ErrorEmbed)
        })
    }

    member.send(`You have been banned from ${message.guild.name} for ${reason}.`)
        .then(() => member.ban({ reason: `${message.author.tag} | ${reason}` }))
        .catch(() => {
            ErrorEmbed.setDescription(`I couldn't DM ${member.user}.`)
            message.channel.send(ErrorEmbed)
        })
    message.channel.send(BanEmbed);
}

export = {
    ban
}
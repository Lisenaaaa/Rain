import { Message, MessageEmbed, TextChannel } from "discord.js"
import utils from '@functions/utils'
import client from '@src/index'

const error = (error: Error, type?: string, message? :Message) => {
    const errorChannel = client.channels.cache.get('824680761470746646') as TextChannel

    const errorCode = utils.getRandomInt(69696969696969)

    let errorStack = error.stack

    if (errorStack.length > 1000) {
        errorStack = errorStack.substring(0, 1000)
    }

    const errorEmbed = new MessageEmbed()
    if (!type) { errorEmbed.setTitle('An error occured!') }
    else { errorEmbed.setTitle(`A${type} error occured!`) }
    errorEmbed.addField('Error code', `\`${errorCode}\``)
    errorEmbed.setDescription(`\`\`\`js\n${errorStack}\`\`\``)
    errorEmbed.setColor('DARK_RED')

    if (message) {
        errorEmbed.addField('More Info', `Guild: ${message.guild.name} (\`${message.guild.id}\`)
        Channel: ${(message.channel as TextChannel).name} (\`${message.channel.id}\`)
        Message ID: \`${message.id}\`
        
        Author: ${message.author.tag} (\`${message.author.id}\`)
        
        [Message Link](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
    }

    errorChannel.send({ /*content: `\`\`\`js\n${errorStack}\`\`\``,*/ embeds: [errorEmbed] })

    const returnErrorEmbed = new MessageEmbed()
        .setTitle('An error occured!')
        .setDescription(`Please give my developer code \`${errorCode}\``)
        .setColor('DARK_RED')

    return returnErrorEmbed
}


export default {
    error
}
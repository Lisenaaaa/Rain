import { ReplyMessageOptions, Message } from "discord.js";

async function reply(message: Message, content: ReplyMessageOptions) {
    if (message.type === 'REPLY') {
        if (message.channel.type == 'GUILD_TEXT') {
            const msgId = message.reference!.messageId
            const repliedMessage = await message.channel.messages.fetch(msgId!)

            const coolReplyContent = {
                ...content,
                ...{ allowedMentions: { repliedUser: true } }
            }
            repliedMessage.reply(coolReplyContent)
        }
    }
    else {
        message.reply(content)
    }
}

export default {
    reply
}
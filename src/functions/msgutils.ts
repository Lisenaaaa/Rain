import { ReplyMessageOptions, Message } from "discord.js";

async function reply(message: Message, content: ReplyMessageOptions) {
    if (message.type == 'REPLY') {
        if (message.channel.type == 'text') {
            const repliedMessage = await message.channel.messages.fetch(message.reference.messageID)

            let coolReplyContent = {
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

export = {
    reply
}
import { AkairoMessage } from 'discord-akairo'
import { Message, ReplyMessageOptions } from 'discord.js'

export class MessageUtils {
	static async reply(message: Message | AkairoMessage, content: ReplyMessageOptions) {
		if ((message as Message).type === 'REPLY') {
			if (message.channel?.type == 'GUILD_TEXT') {
				const msgId = (message as Message).reference?.messageId
				const repliedMessage = await message.channel.messages.fetch(msgId as string)

				const coolReplyContent = {
					...content,
					...{ allowedMentions: { repliedUser: true } },
				}
				repliedMessage.reply(coolReplyContent)
			}
		} else {
			message.reply(content)
		}
	}
}

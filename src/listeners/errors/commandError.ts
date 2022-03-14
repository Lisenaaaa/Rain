import { ApplyOptions } from '@sapphire/decorators'
import { MessageCommandErrorPayload, Listener, ListenerOptions } from '@sapphire/framework'

@ApplyOptions<ListenerOptions>({
	event: 'messageCommandError',
})
export class CommandErrorListener extends Listener {
	public async run(error: Error, payload: MessageCommandErrorPayload) {
		if (this.container.users.isOwner(payload.message.author))
			await payload.message.reply({
				content: `Something went wrong!\n\`\`\`js\n${error.stack}\`\`\``,
			})
		else
			await payload.message.reply({
				embeds: [
					(await this.container.utils.error(error, {
						type: 'command',
						data: {
							link: '',
							// messageOptions: {
							// 	guildID: payload.message.guildId as string,
							// 	channelID: payload.message.channel.id,
							// 	messageID: payload.message.id,
							// },
						},
					})),
				],
			})
	}
}

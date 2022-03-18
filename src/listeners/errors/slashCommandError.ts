import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions, ChatInputCommandErrorPayload } from '@sapphire/framework'

@ApplyOptions<ListenerOptions>({
	event: 'chatInputCommandError',
})
export class SlashCommandErrorListener extends Listener {
	public async run(error: Error, payload: ChatInputCommandErrorPayload) {
		if (this.container.users.isOwner(payload.interaction.user))
			try {
				await payload.interaction.reply({
					content: `Something went wrong!\n\`\`\`js\n${error.stack}\`\`\``,
				})
			} catch (err) {
				await payload.interaction.editReply({
					content: `Something went wrong!\n\`\`\`js\n${error.stack}\`\`\``,
					components: []
				})
			}
		else
			await payload.interaction.reply({
				embeds: [
					await this.container.utils.error(error, {
						type: 'command',
						data: {
							link: `https://discord.com/channels/${payload.interaction.guildId}/${payload.interaction.channelId}/${payload.interaction.id}`,
						},
					}),
				],
			})
	}
}

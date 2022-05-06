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
                components: [],
            })
        else
            await payload.message.reply({
                embeds: [
                    await this.container.utils.error(error, {
                        type: 'command',
                        data: {
                            link: `https://discord.com/channels/${payload.message.guildId}/${payload.message.channelId}/${payload.message.id}`,
                        },
                    }),
                ],
            })
    }
}

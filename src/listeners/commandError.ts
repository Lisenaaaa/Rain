import { ApplyOptions } from '@sapphire/decorators'
import { CommandDeniedPayload, CommandErrorPayload, Listener, ListenerOptions, PreconditionError } from '@sapphire/framework'
import users from '../functions/users'

@ApplyOptions<ListenerOptions>({
	once: true,
	event: 'commandError',
})
export class CommandErrorListener extends Listener {
	public async run(error: Error, payload: CommandErrorPayload) {
		if (users.isOwner(payload.message.author)) await payload.message.reply({content: `Something went wrong!\n\`\`\`js\n${error.stack}\`\`\``})
        
	}
}

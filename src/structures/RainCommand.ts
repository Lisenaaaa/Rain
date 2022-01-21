import { ApplicationCommandRegistry, Command, CommandOptions, PieceContext, RegisterBehavior } from '@sapphire/framework'
import { ApplicationCommandData } from 'discord.js'

export default class RainCommand extends Command {
	constructor(context: PieceContext, options: CommandOptions) {
		super(context, options)
	}

	override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		if (this.chatInputRun && this.name && this.options.slashOptions) {
			const command: ApplicationCommandData = {
				name: this.name,
				description: this.options.slashOptions.description || this.description || 'No description provided.',
				options: this.options.slashOptions.options || [],
			}

			registry.registerChatInputCommand(command, {
				idHints: this.options.slashOptions.idHints,
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				...(this.options.slashOptions.guildIDs ? { guildIds: this.options.slashOptions.guildIDs } : {}),
			})
		}
	}

	parseArgs = this.container.utils.parseInteractionArgs
}

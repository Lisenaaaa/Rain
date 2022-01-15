// /* eslint-disable @typescript-eslint/no-unused-vars */
import { ApplyOptions } from '@sapphire/decorators'
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework'
import { CommandInteraction, User } from 'discord.js'

@ApplyOptions<CommandOptions>({
	name: 'pronouns',
	aliases: ['pronouns'],
	description: 'see someones pronouns',
	preconditions: ['slashOnly'],
})
export class PronounsCommand extends Command {
	public override async chatInputRun(interaction: CommandInteraction) {
		const args: {user: User} = this.container.utils.parseInteractionArgs(interaction)

        const pronouns = await this.container.users.getPronouns(args.user)

        await interaction.reply(`${pronouns}`)
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
				options: [
					{
                        name: 'user',
						description: 'The user you want to know the pronouns of',
						type: 'USER',
                        required: true
					},
				],
			},
			{ guildIds: ['880637463838724166'], idHints: ['931654444691652659'], behaviorWhenNotIdentical: RegisterBehavior.Overwrite }
		)
	}
}

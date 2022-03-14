import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { Interaction } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	event: 'interactionCreate',
})
export class InteractionCreateListener extends Listener {
	public async run(interaction: Interaction) {
		await this.showWelcomeLeaveArgs(interaction)
	}

	public async showWelcomeLeaveArgs(interaction: Interaction) {
		if (!interaction.isButton()) return
		if (interaction.customId !== 'showWelcomeLeaveArgs') return

		await interaction.reply({
			content: `
        \`{user}\`: The user's name and tag. Example: \`skye#8680\`
        \`{user.mention}\`: Mentions the user.
        \`{user.name}\`: The user's username. Example: \`skye\`
        \`{user.tag}\`: The user's tag. Example: \`8680\`
        \`{user.id}\`: The user's ID. Example: \`881310086411190293\`
    
        \`{guild}\`: The server's name.
        \`{guild.size}\`: The current total number of members on the server.
        `,
			ephemeral: true,
		})
	}
}

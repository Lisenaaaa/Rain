/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This handles all slash command interactions.
 */
import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import type { Interaction } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	event: 'interactionCreate',
})
export class CommandInteraction extends Listener {
	async run(interaction: Interaction) {
		if (!interaction.isCommand()) return

		const cmd = this.container.stores.get('slashCommands').get(interaction.commandName)
		if (!cmd) return

		try {
			let runnable = true

			if (cmd.ownerOnly && !(await this.ownerOnly(interaction))) runnable = false

			/*
				PRECONDITIONS
				these are an array of strings with the precondition name
				when a command is ran, it checks the preconditions array (which doesn't have to be there) and runs all of them
				to run it, it checks a custom store for preconditions that match the name, and runs it with the interaction

				if all of them are true, run the thing
				for the first one that returns some sorta error, emit slashDenied with the error and the interaction, and don't run it
			*/

			if (runnable === true) {
				await cmd.run(interaction, this.container.utils.parseInteractionArgs(interaction))
			}
			if (process.env.DEV)
				this.container.logger.info(
					`${interaction.user.id} ran slash command ${cmd.commandData.name}`
				)
		} catch (e: any) {
			this.container.client.emit('slashError', e, interaction)
		}
	}

	async ownerOnly(interaction: Interaction): Promise<boolean> {
		if (!interaction.isCommand()) return false
		const canRun = this.container.config.owners.includes(interaction.user.id)

		if (canRun === false) {
			await interaction.reply({
				content: 'This command is owner only. You cannot use it.',
				ephemeral: true,
			})
		}

		return canRun
	}
}

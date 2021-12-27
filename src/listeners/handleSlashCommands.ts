/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This handles all slash command interactions.
 */
import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import type { Interaction } from 'discord.js'
import { SlashPreconditionError } from '../types/SlashRelatedTypes'

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

			if (cmd.preconditions) {
				for (const c of cmd.preconditions) {
					const condition = this.container.stores.get('slashConditions').get(c.toString().split('_')[1])

					const ran = await condition?.run(interaction)
					if (ran === true) continue
					else {
						runnable = false
						return this.container.client.emit('slashDenied', interaction, (ran as SlashPreconditionError).message)
					}
				}
			}

			if (runnable === true) {
				await cmd.run(interaction, this.container.utils.parseInteractionArgs(interaction))
			} else {
				console.log('command not runnable')
			}
		} catch (e: any) {
			this.container.client.emit('slashError', e, interaction)
		}
	}
}

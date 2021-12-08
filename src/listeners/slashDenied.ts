import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { BaseCommandInteraction } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	event: 'slashDenied',
})
export class CommandDeniedListener extends Listener {
	public async run(interaction: BaseCommandInteraction, message: string) {
		await interaction.reply(message)
	}
}

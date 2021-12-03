import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { BaseCommandInteraction } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	event: 'slashError',
})
export class CommandErrorListener extends Listener {
	public async run(error: Error, interaction: BaseCommandInteraction) {
		await interaction.reply(await this.formatOutput(error.stack as string))
	}

	async formatOutput(output: string): Promise<string> {
		if (!output) return `\`\`\`js\n${output}\`\`\``
		if (output.length >= 1000) {
			return await this.container.utils.haste(output)
		} else return `\`\`\`js\n${output}\`\`\``
	}
}

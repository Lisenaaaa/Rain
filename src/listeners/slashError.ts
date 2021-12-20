import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { BaseCommandInteraction } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	event: 'slashError',
})
export class CommandErrorListener extends Listener {
	public async run(error: Error, interaction: BaseCommandInteraction) {
		await interaction.reply({
			content: `Uh oh! An error occured!`,
			embeds: [
				{
					title: 'Error',
					fields: [
						{ name: 'Message', value: error.message },
						{ name: 'Potential Location', value: `\`${this.getErrorLocation(`${error.stack}`)}\`` },
						{ name: 'Stack', value: await this.container.utils.haste(`${error.stack}`) },
					],
					color: 'RED'
				},
			],
		})
	}

	async formatOutput(output: string): Promise<string> {
		if (!output) return `\`\`\`js\n${output}\`\`\``
		if (output.length >= 1000) {
			return await this.container.utils.haste(output)
		} else return `\`\`\`js\n${output}\`\`\``
	}

	private getErrorLocation(error: string) {
		let path = `${error.split('\n').find((e) => e.includes('.run') && !e.includes('CommandInteraction.run'))}`

		path = path.split(' ')[path.split(' ').length - 1]
		const pathChars = path.split('')
		pathChars[0] = ''
		pathChars[pathChars.length - 1] = ''

		path = pathChars.join('')
		return path
	}
}

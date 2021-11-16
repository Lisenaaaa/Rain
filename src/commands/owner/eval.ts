/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApplyOptions } from '@sapphire/decorators'
import { Args, Command, CommandOptions } from '@sapphire/framework'
import { Message } from 'discord.js'
import util from 'util'

@ApplyOptions<CommandOptions>({
	name: 'eval',
	aliases: ['ev'],
	description: 'run code',
	preconditions: ['ownerOnly'],
})
export class EvalCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const codetoeval = await args.rest('string')

		let codeToEval = `(async () => {${codetoeval}})()`
		if (!codetoeval.includes('await') && !codetoeval.includes('return')) codeToEval = codetoeval
		if (codetoeval.includes('await') && !codetoeval.includes('return'))
			codeToEval = `(async () => { return ${codetoeval}})()`

		let output
		let success
		try {
			const inspect = util.inspect,
				database = this.container.database,
				utils = this.container.utils,
				client = this.container.client,
				config = this.container.config,
				user = message.author,
				member = message.member,
				guild = message.guild,
				channel = message.channel

			output = inspect(await eval(codeToEval), { depth: 0 })
			success = true
		} catch (err) {
			output = err.stack
			success = false
		}

		await message.reply({
			embeds: [
				{
					title: 'Eval Output',
					color: success ? 'GREEN' : 'RED',
					fields: [
						{ name: 'Input', value: `\`\`\`js\n${codetoeval}\`\`\`` },
						{ name: 'Output', value: await this.formatOutput(output) },
					],
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
}

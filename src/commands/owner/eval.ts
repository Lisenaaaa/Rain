import { ApplyOptions } from '@sapphire/decorators'
import { Args, Command, CommandOptions } from '@sapphire/framework'
import { Message } from 'discord.js'
import util from 'util'
import utilities from '../../functions/utilities'

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
			const inspect = util.inspect
			output = JSON.stringify(await eval(codeToEval), undefined, '\t')
			success = true
		} catch (err) {
			output = err
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
			return await utilities.haste(output)
		}

		else return `\`\`\`js\n${output}\`\`\``
    }
}

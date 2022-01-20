/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApplyOptions } from '@sapphire/decorators'
import { Args, CommandOptions } from '@sapphire/framework'
import { Message } from 'discord.js'
import util, { promisify } from 'util'
import { exec } from 'child_process'
import config from '../../config/config'
import { reply } from '@sapphire/plugin-editable-commands'
import RainCommand from '../../structures/RainCommand'

@ApplyOptions<CommandOptions>({
	name: 'eval',
	aliases: ['ev'],
	description: 'run code',
	preconditions: ['ownerOnly'],
	defaultPermissions: 'none',
})
export class EvalCommand extends RainCommand {
	public override async messageRun(message: Message, args: Args) {
		const codetoeval = await args.rest('string')

		let codeToEval = `(async () => {${codetoeval}})()`
		if (!codetoeval.includes('await') && !codetoeval.includes('return')) codeToEval = codetoeval
		if (codetoeval.includes('await') && !codetoeval.includes('return')) codeToEval = `(async () => { return ${codetoeval}})()`

		let output
		let success
		try {
			const inspect = util.inspect,
				database = this.container.database,
				utils = this.container.utils,
				client = this.container.client,
				settings = this.container.settings,
				user = message.author,
				member = message.member,
				guild = message.guild,
				channel = message.channel,
				sh = promisify(exec),
				guilds = {
					cache: this.container.cache.guilds,
					client: this.container.client.guilds,
				},
				container = this.container,
				db = this.container.cache.guilds.get(message.guild?.id as string)

			output = inspect(await eval(codeToEval), { depth: 0 })
			success = true
		} catch (err) {
			output = err.message
			success = false
		}

		await reply(message, {
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
		if (!output) return `\`\`\`js\n${this.cleanOutput(output)}\`\`\``
		if (this.cleanOutput(output).length >= 1000) {
			return await this.container.utils.haste(this.cleanOutput(output))
		} else return `\`\`\`js\n${this.cleanOutput(output)}\`\`\``
	}

	cleanOutput(output: string) {
		const credentials = new config()
		const tokens = credentials.tokens
		const database = credentials.database

		for (const key of Object.keys(tokens)) {
			output = output.replaceAll(tokens[key as keyof typeof tokens], `tokens.${key}`)
		}

		for (const key of Object.keys(database)) {
			output = output.replaceAll(database[key as keyof typeof database], `database.${key}`)
		}

		return output
	}
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApplyOptions } from '@sapphire/decorators'
import { Args, CommandOptions } from '@sapphire/framework'
import { Message } from 'discord.js'
import util, { promisify } from 'util'
import { exec } from 'child_process'
import { tokens, database } from '../../config/config'
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
				utils = this.container.utils,
				client = this.container.client,
				settings = this.container.settings,
				user = message.author,
				member = message.member,
				guild = message.guild,
				channel = message.channel,
				sh = promisify(exec),
				container = this.container,
				db = this.container.database.guilds.findByPk(message.guildId as string),
				dbInfo = `\`\`\`js
				// add //
				await GuildDatabase.create({ id: 'id' })
				// fetch //
				await GuildDatabase.findByPk('id') // the database, or \`null\` if it isn't there
				await ModlogDatabase.findOne({ where: { memberId: 'member id', guildId: 'guild id' } }) // use this for most things, as there are two ids and not just one (like, when finding a specific member's modlogs)
				// fetch all //
				await GuildDatabase.findAll() // remove the map if you want to, say, run something on all of them
				// edit //
				await GuildDatabase.update({ welcomeMessage: 'hi {user} you suck xfbvndskjhfgbndsfkjh,gbndskjjgbfhn' }, { where: { id: 'id' } })
				// delete //
				await GuildDatabase.destroy({ where: { id: 'id' } })\`\`\`
				`

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
		for (const key of Object.keys(tokens)) {
			output = output.replaceAll(tokens[key as keyof typeof tokens], `tokens.${key}`)
		}

		for (const key of Object.keys(database)) {
			output = output.replaceAll(database[key as keyof typeof database], `database.${key}`)
		}

		return output
	}
}

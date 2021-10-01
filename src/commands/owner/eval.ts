/* eslint-disable @typescript-eslint/no-unused-vars */
import chalk from 'chalk'
import { exec } from 'child_process'
import { Guild, Interaction, Message, MessageEmbed } from 'discord.js'
import { promisify, inspect } from 'util'
import { RainCommand } from '@extensions/RainCommand'

import importUtils from '@functions/utils'
const utils = importUtils

import importDatabase from '@functions/database'
import { AkairoMessage } from 'discord-akairo'
import { EvalOptions, modlogs } from '@src/types/misc'
const database = importDatabase

const sh = promisify(exec)

export default class evaluate extends RainCommand {
	constructor() {
		super('eval', {
			aliases: ['eval', 'ev', 'exec'],
			args: [
				{ id: 'codetoeval', type: 'string', match: 'rest' },
				{ id: 'silent', match: 'flag', flag: '--silent' },
				{ id: 'sudo', match: 'flag', flag: '--sudo' },
			],
			ownerOnly: true,
			description: 'run code',

			slash: true,
			slashOptions: [
				{
					name: 'codetoeval',
					description: 'code',
					type: 'STRING',
					required: true,
				},
				{ name: 'silent', description: 'no embed', type: 'BOOLEAN' },
				{
					name: 'sudo',
					description: 'bypass a few things',
					type: 'BOOLEAN',
				},
			],
			slashGuilds: ['880637463838724166'],
		})
	}

	async exec(message: Message, args: EvalOptions) {
		//if (message.author.id != '881310086411190293') {return message.reply('no u')}

		if (args.codetoeval.includes('channel.delete')) {
			return message.reply('Are you IRONM00N?')
		}
		if (args.codetoeval.includes('guild.delete')) {
			return message.reply("You're like IRONM00N but infinitely more stupid!")
		}
		if (args.codetoeval.includes('delete') && !args.sudo) {
			return message.reply('This would be blocked by smooth brain protection, but BushBot has a license')
		}

		const guild = message.guild
		const client = this.client
		const channel = message.channel
		const embed = new MessageEmbed()
		const user = message.author
		const member = message.member
		const botUser = this.client.user
		const botMember = message.guild?.me

		let output

		try {
			output = await eval(`(async () => {${args.codetoeval}})()`)
			output = inspect(output, { depth: 0 })
			output = utils.censorString(output)
		} catch (err) {
			const errorStack = err.stack.substring(0, 1000)

			output = utils.censorString(errorStack)
		}

		output = utils.censorString(output)

		const evalEmbedDisabledGuilds = ['794610828317032458']
		const evalDisabledGuildChannelBypass = ['834878498941829181']

		if (evalEmbedDisabledGuilds.includes(message.guild?.id as string) && !evalDisabledGuildChannelBypass.includes(message.channel.id)) {
			if (args.codetoeval.includes('message.delete')) {
				return
			} else {
				//return message.react('<:successAnimated:881336936533483520>')
			}
		}

		if (!args.silent && !args.codetoeval.includes('message.channel.delete()')) {
			const evalOutputEmbed = new MessageEmbed().setTitle('Evaluated Code').addField(':inbox_tray: **Input**', `\`\`\`js\n${args.codetoeval}\`\`\``)
			if (message.member) evalOutputEmbed.setColor(message.member.displayColor)

			output = `\`\`\`js\n${output}\`\`\``

			if (output.length > 900) {
				const haste = await utils.haste(utils.censorString(output))
				output = output.substring(0, 900)
				output = output + `\`\`\`\nThe output was too large to display, so it was uploaded to [hastebin](${haste})`
			}

			evalOutputEmbed.addField(':outbox_tray: **Output**', output)

			if (!message.interaction) {
				await message.util?.reply({ embeds: [evalOutputEmbed] })
			}
			if (message.interaction) {
				await message.reply({ embeds: [evalOutputEmbed] })
			}
		}
		if (args.silent && !message.interaction) {
			if (args.codetoeval.includes('message.delete')) {
				return
			}
			message.react('<:success:838816341007269908>')
		} else if (args.silent && message instanceof AkairoMessage) {
			return message.reply({
				content: "i can't really send nothing",
				ephemeral: true,
			})
		}
	}
}

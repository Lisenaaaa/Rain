/**
 * This ping command is from https://github.com/YorkAARGH/Sapphire-slashies-example, but with a few small changes
 */
import type { PieceContext } from '@sapphire/framework'
import type { CommandInteraction, Message } from 'discord.js'
import { SlashCommand } from '../structures/SlashCommandPiece'

export class Ping extends SlashCommand {
	constructor(context: PieceContext) {
		super(context, {
			name: 'ping',
			description: 'Pongs when pinged.',
			options: [],
			guilds: ['880637463838724166'],
		})
	}

	async run(interaction: CommandInteraction) {
		const reply = await interaction.reply({ content: 'ping', fetchReply: true })
		await interaction.editReply(
			`Pong! Latency is ${
				(reply as Message).createdTimestamp - interaction.createdTimestamp
			}ms. API Latency is ${Math.round(this.container.client.ws.ping)}ms.`
		)
	}
}

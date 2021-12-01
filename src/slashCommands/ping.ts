/**
 * This is the most basic slash command example I can offer you guys, it's not
 * using the builder but that can easily be changed. If you want your slash
 * commands to be guild specific, you should consult the discordjs.guide for
 * how to register them to guilds, here's a link;
 * https://discordjs.guide/interactions/registering-slash-commands.html#guild-commands
 *
 */

/**
 * This ping command is from https://github.com/YorkAARGH/Sapphire-slashies-example
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
			guildOnly: true,
			guilds: ['880637463838724166'],
		})
	}

	async run(interaction: CommandInteraction) {
		await interaction.deferReply()
		const reply = await interaction.editReply('Ping?')
		await interaction.editReply(
			`Pong! Latency is ${
				(reply as Message).createdTimestamp - interaction.createdTimestamp
			}ms. API Latency is ${Math.round(this.container.client.ws.ping)}ms.`
		)
	}
}

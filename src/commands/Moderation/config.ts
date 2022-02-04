import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { ButtonInteraction, CommandInteraction, Guild, Interaction, Message, MessageOptions, Snowflake, TextChannel } from 'discord.js'
import RainCommand from '../../structures/RainCommand'

@ApplyOptions<CommandOptions>({
	name: 'config',
	aliases: ['config'],
	description: 'configure the guild',
	preconditions: ['slashOnly', 'permissions', 'GuildOnly'],
	defaultPermissions: 'srMod',
	userDiscordPerms: ['MANAGE_GUILD'],
	slashOptions: {
		guildIDs: ['880637463838724166'],
		idHints: ['928065482647535687'],
	},
})
export class ConfigCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.reply({
			content: 'config',
			components: [
				{
					type: 'ACTION_ROW',
					components: [
						{
							type: 'BUTTON',
							label: 'welcome',
							style: 'PRIMARY',
							customId: 'configWelcome',
						},
					],
				},
			],
		})

		const button = await this.awaitInteraction(interaction.user.id, interaction.channel as TextChannel)

		if (button?.customId === 'configWelcome') {
			await button.deferUpdate()
			const msg = await this.promptMessage(
				interaction,
				{ content: 'what channel do you want to set as the welcome channel (reply `null` to unset it)', components: [] },
				this.getTimeInSeconds(60)
			)
			if (!msg?.content) {
				await msg?.delete()
				await interaction.editReply({ content: "your message needs content, i can't get a channel from a screenshot or whatever" })
			}

			this.container.logger.debug(this.container.guilds.findChannel(interaction.guild as Guild, msg?.content as string))

			await interaction.followUp(`${msg?.content}`)
		}
	}

	private getTimeInSeconds(t: number) {
		return t * 1000
	}

	private async promptMessage(interaction: CommandInteraction, options: MessageOptions, seconds: number): Promise<Message | undefined> {
		const filter = (m: Message) => m.author.id === interaction.user.id
		if (interaction.replied) {
			await interaction.editReply(options)
		} else {
			await interaction.reply(options)
		}

		const message = await (interaction.channel as TextChannel).awaitMessages({ filter, time: this.getTimeInSeconds(seconds), max: 1, errors: ['time'] })
		return message.first()
	}

	private async awaitInteraction(user: Snowflake, channel: TextChannel): Promise<ButtonInteraction | undefined> {
		return await channel.awaitMessageComponent({ componentType: 'BUTTON', filter: (b: Interaction) => b.user.id === user, time: this.getTimeInSeconds(60) })
	}
}

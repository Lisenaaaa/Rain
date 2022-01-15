// /* eslint-disable @typescript-eslint/no-unused-vars */
import { ApplyOptions } from '@sapphire/decorators'
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework'
import { CommandInteraction, Message, MessageActionRow, MessageComponentInteraction, MessageOptions, TextChannel } from 'discord.js'

@ApplyOptions<CommandOptions>({
	name: 'config',
	aliases: ['config'],
	description: 'mess with your guilds settings',
	preconditions: ['ownerOnly'],
})
export class ConfigCommand extends Command {
	public override async messageRun(message: Message) {
		await Replies.notSlashError(message)
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		const buttonFilter = (b: MessageComponentInteraction) => b.user.id === interaction.user.id && b.customId.startsWith('config')

		const row = new MessageActionRow({ components: [{ type: 'BUTTON', label: 'Welcome', customId: 'config|welcome', style: 'PRIMARY' }] })
		await interaction.reply({ embeds: [{ title: 'config', description: 'configure the guild' }], components: [row] })

		const configThing = await interaction.channel?.awaitMessageComponent({ filter: buttonFilter, time: this.getTimeInSeconds(60), componentType: 'BUTTON' })

		switch (configThing?.customId.split('|')[1]) {
			case 'welcome': {
				const msg = await this.promptMessage(interaction, Replies.welcomeChannel, 60)
				const channelIdentifier = msg?.content

				await interaction.followUp(channelIdentifier as string)
			}
		}
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
			},
			{ guildIds: ['880637463838724166'], idHints: ['928065482647535687'], behaviorWhenNotIdentical: RegisterBehavior.Overwrite }
		)
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
}

class Replies {
	static async notSlashError(message: Message) {
		await message.reply('Please use this as a slash command.')
	}

	static welcomeChannel: MessageOptions = { content: 'What channel would you like the welcome message to send in?', embeds: [], components: [] }
}

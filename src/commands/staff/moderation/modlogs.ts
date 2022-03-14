import { ApplyOptions } from '@sapphire/decorators'
import { PaginatedMessage, runsOnInteraction } from '@sapphire/discord.js-utilities'
import { CommandOptions } from '@sapphire/framework'
import { APIMessage } from 'discord-api-types'
import { ApplicationCommandOptionType, ButtonStyle, CommandInteraction, ComponentType, Message } from 'discord.js'
import RainCommand from '../../../structures/RainCommand'
import { ArgsUser, ModlogDurationTypes, ModlogTypes } from '../../../types/misc'

@ApplyOptions<CommandOptions>({
	name: 'modlogs',
	aliases: ['modlogs'],
	description: "see someone's modlogs",
	preconditions: ['slashOnly', 'permissions', 'GuildOnly'],
	defaultPermissions: 'trialHelper',
	userDiscordPerms: ['ManageMessages'],
	botPerms: [],
	slashOptions: {
		guildIDs: ['880637463838724166'],
		idHints: ['933929396945952779'],
		options: [
			{
				type: ApplicationCommandOptionType.Subcommand,
				name: 'view',
				description: "view a specfic modlog, based on it's id",
				options: [
					{
						name: 'modlog',
						description: 'the id of the modlog you want to see',
						type: ApplicationCommandOptionType.String,
						required: true,
					},
				],
			},
			{
				type: ApplicationCommandOptionType.Subcommand,
				name: 'user',
				description: "view a specific user's modlogs",
				options: [
					{
						name: 'member',
						description: 'the person you want the modlogs of',
						type: ApplicationCommandOptionType.User,
						required: true,
					},
				],
			},
			{
				type: ApplicationCommandOptionType.Subcommand,
				name: 'edit-description',
				description: 'edit the description of a specific modlog',
				options: [
					{ name: 'modlog', type: ApplicationCommandOptionType.String, description: 'the ID of the modlog you want to edit', required: true },
					{ name: 'reason', type: ApplicationCommandOptionType.String, description: 'the new reason for the modlog', required: true },
				],
			},
		],
	},
})
export class ModlogsCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const subCmd = interaction.options.get('Subcommand', true).name
		switch (subCmd) {
			case 'user':
				await this.user(interaction)
				break
			case 'edit-description':
				await this.editDescription(interaction)
				break
			case 'view':
				await this.view(interaction)
				break
		}
	}

	async user(interaction: CommandInteraction) {
		const args: { member: ArgsUser } = this.parseArgs(interaction)

		const modlogs = await this.container.database.modlogs.findAll({ where: { userId: args.member.user.id, guildId: interaction.guild?.id as string } })
		if (modlogs.length === 0) return await interaction.reply('That user has no modlogs!')

		const allModlogs = []
		for (const modlog of modlogs) {
			const formattedModlog = `ID: \`${modlog.id}\`\nType: ${modlog.type.toLowerCase()}${modlog.reason ? `\nReason: ${modlog.reason}` : ''}\nModerator: ${await this.container.client.users.fetch(
				modlog.modId
			)} (${(await this.container.client.users.fetch(modlog.modId)).tag})${
				modlog.expires ? `\nExpires: <t:${Math.floor(modlog.expires.getTime() / 1000)}:R>` : `${this.typeIsPunishment(modlog.type) ? '\nExpires: when hell freezes over' : ''}`
			}\nCreated at <t:${Math.floor(modlog.createdAt.getTime() / 1000)}>`

			allModlogs.push(formattedModlog)
		}

		const newModlogArray = this.container.utils.splitArrayIntoMultiple(allModlogs, 5)
		const embedsArray = []

		for (const modlogs of newModlogArray) {
			let modlogString = ''
			for (const modlog of modlogs) {
				if (modlogString.length === 0) modlogString += modlog
				else modlogString += `\n-------------------------------------\n${modlog}`
			}

			embedsArray.push({ title: `${args.member.user.tag}'s modlogs`, description: modlogString, footer: { text: `${args.member.user.id}` } })
		}

		// await this.container.utils.paginate(interaction, embedsArray)
		const paginatedMsg = new PaginatedMessage().setActions([
			{
				customId: '@sapphire/paginated-messages.firstPage',
				style: 'PRIMARY',
				emoji: '<:paginate1:903780818755915796>',
				type: ComponentType.Button,
				run: ({ handler }) => (handler.index = 0),
			},
			{
				customId: '@sapphire/paginated-messages.previousPage',
				style: 'PRIMARY',
				emoji: '<:paginate2:903780882203160656>',
				type: ComponentType.Button,
				run: ({ handler }) => {
					if (handler.index === 0) {
						handler.index = handler.pages.length - 1
					} else {
						--handler.index
					}
				},
			},
			{
				customId: '@sapphire/paginated-messages.stop',
				style: ButtonStyle.Danger,
				emoji: '<:paginate_stop:940750448544063559>',
				type: ComponentType.Button,
				run: async ({ collector, response }) => {
					collector.stop()
					if (runsOnInteraction(response)) {
						if (response.replied || response.deferred) {
							await response.editReply({ components: [] })
						} else if (response.isMessageComponent()) {
							await response.update({ components: [] })
						} else {
							await response.reply({ content: "This maze wasn't meant for you...what did you do.", ephemeral: true })
						}
					} else if (this.isMessageInstance(response)) {
						await response.edit({ components: [] })
					}
				},
			},
			{
				customId: '@sapphire/paginated-messages.nextPage',
				style: 'PRIMARY',
				emoji: '<:paginate3:903780978940596295>',
				type: ComponentType.Button,
				run: ({ handler }) => {
					if (handler.index === handler.pages.length - 1) {
						handler.index = 0
					} else {
						++handler.index
					}
				},
			},
			{
				customId: '@sapphire/paginated-messages.goToLastPage',
				style: 'PRIMARY',
				emoji: '<:paginate4:903781017544953966>',
				type: ComponentType.Button,
				run: ({ handler }) => (handler.index = handler.pages.length - 1),
			},
		])
		for (const embed of embedsArray) {
			paginatedMsg.addPageEmbed(embed)
		}
		await paginatedMsg.run(interaction)
	}
	async editDescription(interaction: CommandInteraction) {
		const args: { modlog: string; reason: string } = this.parseArgs(interaction)

		const edited = await this.container.database.modlogs.update({ reason: args.reason }, { where: { id: args.modlog, guildId: interaction.guildId } })

		if (edited[0] === 0) {
			return await interaction.reply("I couldn't find that modlog.")
		} else {
			return await interaction.reply('Sucessfully edited that modlog.')
		}
	}
	async view(interaction: CommandInteraction) {
		const args: { modlog: string } = this.parseArgs(interaction)

		const modlog = await this.container.database.modlogs.findOne({ where: { id: args.modlog, guildId: interaction.guildId } })
		if (!modlog) {
			return await interaction.reply("I couldn't find that modlog.")
		}

		await interaction.reply(
			`Type: ${modlog.type.toLowerCase()}${modlog.reason ? `\nReason: ${modlog.reason}` : ''}\nModerator: ${await this.container.client.users.fetch(modlog.modId)} (${
				(
					await this.container.client.users.fetch(modlog.modId)
				).tag
			})${
				modlog.expires ? `\nExpires: <t:${Math.floor(modlog.expires.getTime() / 1000)}:R>` : `${this.typeIsPunishment(modlog.type) ? '\nExpires: when hell freezes over' : ''}`
			}\nCreated at <t:${Math.floor(modlog.createdAt.getTime() / 1000)}>`
		)
	}

	typeIsPunishment(type: ModlogTypes): type is ModlogDurationTypes {
		const types = ['BAN', 'MUTE']
		return types.includes(type)
	}
	isMessageInstance(message: APIMessage | Message): message is Message {
		return message instanceof Message
	}
}

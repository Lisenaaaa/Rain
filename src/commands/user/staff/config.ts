import { BotCommand } from '@extensions/BotCommand'
import commandManager from '@functions/commandManager'
import database from '@functions/database'
import utils from '@functions/utils'
import { Guild, Interaction, Message, MessageButton, Role } from 'discord.js'
import { MessageActionRow, MessageSelectMenu } from 'discord.js'

export default class config extends BotCommand {
	constructor() {
		super('config', {
			aliases: ['config'],
			description: 'configure the bot',
			usage: '-config',
			discordPerms: ['MANAGE_GUILD'],

			slash: true,
			slashGuilds: utils.slashGuilds,
		})
	}
	async exec(message: Message) {
		if (!(await commandManager.checkIfCommandCanBeUsed(message, this.id))) {
			return message.reply('<a:nonofast:862857752124194816> you arent cool enough to config')
		}

		const filter = (i: Interaction) => i.user.id == message.author.id
		const filterMsg = (m: Message) => m.author.id == message.author.id

		const dotThen = message.channel.createMessageCollector({ filter: filterMsg, time: 15000 })

		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId('configCommand1')
				.setPlaceholder('Nothing selected')
				.addOptions([
					{
						label: 'Toggle commands',
						description: 'enable/disable a command',
						value: 'configToggleCommand',
					},
					{
						label: 'Set role permissions',
						description: 'Set a role to admin, moderator, helper, etc',
						value: 'configSetRolePerms',
					},
				])
		)

		const botMsg = await message.reply({ content: 'config (you have 15 seconds to choose an option this may go up later but probably not)', components: [row] })
		const guild = message.guild as Guild

		try {
			await message.channel.awaitMessageComponent({ filter, time: 15000 }).then(async (interaction) => {
				if (interaction.customId === 'configToggleCommand') {
					const allIDs = commandManager.getAllCommandIDs()
					let idString = ''

					allIDs.forEach((id) => {
						idString += `\`${id}\`,\n`
					})
					idString = idString.substring(0, idString.length - 2)

					const row = new MessageActionRow().addComponents(new MessageButton().setCustomId('configViewAllCommandIDs').setLabel('Show All IDs').setStyle('PRIMARY'))
					await botMsg.edit({ content: "Please send the ID of the command you want to toggle. (they aren't hard to guess, the ban command's id is `ban`)", components: [row] })

					await message.channel.awaitMessageComponent({ time: 1500000 }).then((interaction) => {
						interaction.reply({ content: idString, ephemeral: true })
					})

					dotThen.once('collect', async (msg) => {
						if (allIDs.includes(msg.content)) {
							botMsg.edit('that is a command')
						}
					})
					//interaction.reply(idString)
				}

				if (interaction.customId === 'configSetRolePerms') {
					const roleRow = new MessageActionRow().addComponents(
						new MessageSelectMenu()
							.setCustomId('configCommandSetRolePermsDropdown')
							.setPlaceholder("I can't change the permissions of nothing!")
							.addOptions([
								{
									label: 'Owner',
									description: "The role that the server's owner has",
									value: 'owner',
								},
								{
									label: 'Admin',
									description: "The role that the server's administrators have",
									value: 'admin',
								},
								{
									label: 'Sr. Moderator',
									description: "The role that the server's senior mods have",
									value: 'srMod',
								},
								{
									label: 'Moderator',
									description: "The role that the server's moderators have",
									value: 'moderator',
								},
								{
									label: 'Helper',
									description: "The role that the server's helpers have",
									value: 'helper',
								},
								{
									label: 'Trial Helper',
									description: "The role that the server's trial helpers have",
									value: 'trialHelper',
								},
							])
					)
					botMsg.edit({ content: 'Which position would you like to set the permissions of?', components: [roleRow] })

					await message.channel.awaitMessageComponent({ filter, time: 15000 }).then(async (interaction) => {
						const position = interaction.customId
						await interaction.reply({ content: `Please mention or send the ID of the role you would like to set to ${position}` })

						let role
						dotThen.once('collect', async (msg: Message) => {
							if (msg.author.id != message.author.id) {
								await msg.reply({ content: 'you cant do that' })
								return
							}
							role = this.client.util.resolveRole(msg.content, guild.roles.cache) as Role
							if (role == undefined) {
								await msg.reply({ content: "That isn't a role. You have one more try." })
								dotThen.once('collect', async (msg) => {
									role = this.client.util.resolveRole(msg.content, guild.roles.cache)
									if (role == undefined) {
										await msg.reply("That isn't a role. This command has expired.")
										return
									} else {
										await msg.reply(`Set **${role.name}** to ${position}`)
										await database.editRolePermissions(guild.id, position, role.id)
									}
								})
							} else {
								await msg.reply(`Set ${role} to ${position}`)
								await database.editRolePermissions(guild.id, position, role.id)
							}
						})
					})
				}
			})
		} catch (err) {
			if (err == 'Error [INTERACTION_COLLECTOR_ERROR]: Collector received no interactions before ending with reason: time') {
				botMsg.edit({ content: 'it has been 15 seconds and you have done nothing so the command has expired', components: [] })
				console.log('edited msg because its been 15 seconds')
			} else {
				this.handler.emitError(err, message, this)
			}
		}
	}
}

import { BotCommand } from '@extensions/BotCommand'
import { RainGuild } from '@extensions/discord.js/Guild'
import { RainMessage } from '@extensions/discord.js/Message'
import utils from '@functions/utils'
import { GuildTextBasedChannels } from 'discord-akairo'
import { BaseGuildVoiceChannel, Collection, Interaction, InteractionReplyOptions, Message, MessageActionRow, MessageButton } from 'discord.js'

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
	async exec(message: RainMessage) {
		if (!message.guild) return await message.reply({ content: "This won't work if it isn't on a server!" })
		if (!message.guild && message.interaction) return await message.reply({ content: "This won't work if it isn't on a server!", ephemeral: true } as InteractionReplyOptions)

		const filter = (i: Interaction) => i.user.id == message.author.id
		const filterMsg = (m: Message) => m.author.id == message.author.id
		const interactionCollector = await message.channel.createMessageComponentCollector({ filter, time: 60000 })
		const messageCollector = await message.channel.createMessageCollector({ filter: filterMsg, time: 60000 })

		const OptionsRow = new MessageActionRow().addComponents(
			new MessageButton({ customId: 'configRestrictChannels', label: 'Restrict Channels', style: 'PRIMARY' }),
			new MessageButton({ customId: 'configLogChannels', label: 'Logging Channels', style: 'PRIMARY' }),
			new MessageButton({ customId: 'configStaffRoles', label: 'Set Staff Roles', style: 'PRIMARY' })
		)

		const sent = await message.reply({ embeds: [{ title: `${message.guild?.name}'s Config`, description: 'idk ill make this soon' }], components: [OptionsRow] })

		interactionCollector.once('collect', async (i) => {
			switch (i.customId) {
				case 'configRestrictChannels':
					await sent.edit({ content: 'What channel would you like to edit?', embeds: [], components: [] })

					messageCollector.once('collect', async (m) => {
						await m.delete()

						const channel = await this.client.util.resolveChannel(m.content, m.guild?.channels.cache as Collection<string, GuildTextBasedChannels | BaseGuildVoiceChannel>)

						if (channel === undefined) {
							await sent.edit({ content: "I couldn't find that channel.", embeds: [], components: [] })
							return
						}
						if (channel.type != 'GUILD_TEXT') {
							await sent.edit({ content: `${channel} is not a valid channel.`, embeds: [], components: [] })
							return
						}

						const restrictChannelPermsRow = new MessageActionRow().addComponents(
							new MessageButton({ customId: 'configRestrictChannels|owner', label: 'Owner', style: 'PRIMARY' }),
							new MessageButton({ customId: 'configRestrictChannels|admin', label: 'Admin', style: 'PRIMARY' }),
							new MessageButton({ customId: 'configRestrictChannels|srMod', label: 'Sr. Mod', style: 'PRIMARY' }),
							new MessageButton({ customId: 'configRestrictChannels|moderator', label: 'Moderator', style: 'PRIMARY' }),
							new MessageButton({ customId: 'configRestrictChannels|helper', label: 'Helper', style: 'PRIMARY' }),
							new MessageButton({ customId: 'configRestrictChannels|trialHelper', label: 'Trial Helper', style: 'PRIMARY' })
						)
						await sent.edit({ content: `Alright! What perms would you like to restrict ${channel} to?`, embeds: [], components: [restrictChannelPermsRow] })

						
					})
					break
			}
		})
	}
}

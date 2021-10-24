import { RainGuild } from '@extensions/discord.js/Guild'
import { DRainMessage } from '@extensions/discord.js/Message'
import { RainCommand } from '@extensions/RainCommand'
import utils from '@functions/utils'
import { perms } from '@src/types/misc'
import { AkairoMessage } from 'discord-akairo'
import { Channel } from 'discord.js'

export default class ChannelPerms extends RainCommand {
	constructor() {
		super('channelPerms', {
			aliases: ['setChannelPerms'],
			slash: true,
			slashGuilds: utils.slashGuilds,
			description: 'Set permissions for a channel.',
			slashOptions: [
				{
					name: 'action',
					type: 'STRING',
					description: 'Set or remove permissions for a channel.',
					choices: [
						{
							name: 'set',
							value: 'set',
						},
						{
							name: 'remove',
							value: 'remove',
						},
					],
					required: true,
				},
				{
					name: 'channel',
					type: 'CHANNEL',
					description: 'The channel you would like to restrict commands in.',
					required: true,
				},
				{
					name: 'perms',
					type: 'STRING',
					description: 'The permissions that you would like to restrict commands in the channel to.',
					choices: [
						{ name: 'owner', value: 'owner' },
						{ name: 'admin', value: 'admin' },
						{ name: 'sr. mod', value: 'srMod' },
						{ name: 'moderator', value: 'moderator' },
						{ name: 'helper', value: 'helper' },
						{ name: 'trial helper', value: 'helper' },
					],
					required: true,
				},
			],
			defaultPerms: 'srMod',
			rainPerms: ['SEND_MESSAGES']
		})
	}

	async exec(message: DRainMessage) {
		await message.reply('Please use this as a slashcommand.')
	}

	async execSlash({ interaction }: AkairoMessage, { action, channel, perms }: { action: 'set' | 'remove'; channel: Channel; perms: string }) {
		switch (action) {
			case 'set': {
				const restrictedChannel = await (interaction.guild as RainGuild).setChannelPerms(channel.id, perms as perms)

				await interaction.reply({
					content: `${
						restrictedChannel
							? `I have succesfully made it so that only people with ${perms} can run commands in ${channel}.\nSome slashcommands will still work, they'll just be ephemeral.`
							: `I failed to restrict ${channel} to ${perms}. This error has been automatically reported to my developer.`
					}`,
					ephemeral: true,
				})
				break
			}
			case 'remove': {
				const restrictedChannel = await (interaction.guild as RainGuild).removeChannelPerms(channel.id, perms as perms)

				await interaction.reply({
					content: `${
						restrictedChannel
							? `I have succesfully made it so that only people with ${perms} can run commands in ${channel}.\nSome slashcommands will still work, they'll just be ephemeral.`
							: `I failed to restrict ${channel} to ${perms}. This error has been automatically reported to my developer.`
					}`,
					ephemeral: true,
				})
				break
			}
		}
	}
}

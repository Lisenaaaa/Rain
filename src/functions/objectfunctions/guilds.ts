import { container } from '@sapphire/pieces'
import { BanOptions, Channel, Guild, GuildChannel, GuildEmoji, GuildMember, GuildResolvable, Invite, MessageEmbed, Role, UserResolvable } from 'discord.js'
import { GuildAttributes } from '../databases/guild'
import { GuildCommandAttributes } from '../databases/guildCommands'

export default class Guilds {
	async registerCommands(guild: GuildResolvable) {
		try {
			if (!(await container.database.guilds.findByPk(this.getId(guild)))) {
				await container.database.guilds.create({ id: this.getId(guild) })
			}

			const allCommands: string[] = container.utils.getAllCommands()
			const allGuildCommands = await container.database.guildCommands.findAll({ where: { guildId: this.getId(guild) } })
			const guildCommandsArray: string[] = []

			allGuildCommands.forEach((c: GuildCommandAttributes) => {
				guildCommandsArray.push(c.commandId)
			})

			allGuildCommands.forEach(async (guildCommand: GuildCommandAttributes) => {
				if (!allCommands.includes(guildCommand.commandId)) {
					await container.database.guildCommands.destroy({ where: { guildId: this.getId(guild), commandId: guildCommand.commandId } })
					container.logger.debug(`Removed ${guildCommand.commandId} from ${this.getId(guild)}'s database entry`)
				}
			})

			allCommands.forEach(async (c: string) => {
				if (allGuildCommands.find((cmd: GuildCommandAttributes) => cmd.commandId === c)) return

				const permissions = container.utils.getCommand(c)?.options.defaultPermissions

				await container.database.guildCommands.create({ commandId: c, guildId: this.getId(guild), enabled: true, requiredPerms: permissions ?? 'none' })
				container.logger.debug(`Added ${c} to ${this.getId(guild)}'s database entry`)
			})

			return true
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: "Failed to register a guild's commands" },
			})
		}
	}

	async ban(guild: Guild, user: UserResolvable, options: BanOptions, time?: Date) {
		try {
			const person = await container.client.users.fetch(user)
			await guild.bans.create(user, options)
			if (!(await container.database.guilds.findByPk(guild.id))) {
				await container.database.guilds.create({ id: guild.id })
			}

			await container.database.members.update({ banExpires: time }, { where: { guildId: guild.id, memberId: person.id } })
			return true
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Something went wrong while banning a member.' },
			})
			return false
		}
	}

	async unban(guild: Guild, user: UserResolvable, reason?: string) {
		try {
			const person = await container.client.users.fetch(user)
			await guild.bans.remove(user, reason)
			if (!(await container.database.guilds.findByPk(guild.id))) {
				await container.database.guilds.create({ id: guild.id })
			}

			await container.database.members.update({ banExpires: null }, { where: { guildId: guild.id, memberId: person.id } })
			return true
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Something went wrong while unbanning a member.' },
			})
			return false
		}
	}

	async hasStaffRoles(guild: GuildResolvable) {
		if (!(await container.database.guilds.findByPk(this.getId(guild)))) {
			await container.database.guilds.create({ id: this.getId(guild) })
		}

		const db = (await container.database.guilds.findByPk(this.getId(guild))) as GuildAttributes

		if (db.ownerRole === null && db.adminRole === null && db.srModRole === null && db.modRole === null && db.helperRole === null && db.trialHelperRole === null) return false
		else return true
	}

	findChannel(guild: Guild, query: string): Channel | undefined {
		const channels = guild.channels.cache

		let channel
		channel = channels.get(query.replace('<', '').replace('#', '').replace('>', ''))

		if (!channel) {
			channel = channels.find((c) => c.name.toLowerCase() === query.toLowerCase())
		}

		return channel
	}

	async getAllCommands(guild: GuildResolvable) {
		if (!(await container.database.guilds.findByPk(this.getId(guild)))) {
			await container.database.guilds.create({ id: this.getId(guild) })
		}

		return container.database.guildCommands.findAll()
	}

	getId(resolvable: GuildResolvable): string {
		if (resolvable instanceof Guild) {
			return resolvable.id
		}
		if (resolvable instanceof GuildChannel) {
			return resolvable.guildId
		}
		if (resolvable instanceof GuildMember) {
			return resolvable.guild.id
		}
		if (resolvable instanceof GuildEmoji) {
			return resolvable.guild.id
		}
		if (resolvable instanceof Invite) {
			//forcing it to not be null here because i honestly can't see myself using this function with an invite that doesn't have a guild, and i also have no clue how invites can end up without a guild
			return resolvable.guild!.id
		}
		if (resolvable instanceof Role) {
			return resolvable.guild.id
		}
		return resolvable
	}

	async log(guild: GuildResolvable, type: 'message' | 'member' | 'moderation' | 'action', embed: MessageEmbed): Promise<boolean> {
		guild = await container.client.guilds.fetch(this.getId(guild))

		let channelId: string | null | undefined
		switch (type) {
			case 'message':
				channelId = (await container.database.guilds.findByPk(guild.id))?.messageLoggingChannel
				break
			case 'member':
				channelId = (await container.database.guilds.findByPk(guild.id))?.memberLoggingChannel
				break
			case 'moderation':
				channelId = (await container.database.guilds.findByPk(guild.id))?.moderationLoggingChannel
				break
			case 'action':
				channelId = (await container.database.guilds.findByPk(guild.id))?.actionLoggingChannel
				break
		}

		if (!channelId) {
			return false
		}

		const channel = guild.channels.cache.get(channelId)
		if (!channel || !channel.isText() || channel.isThread()) {
			return false
		}

		const webhooks = await channel.fetchWebhooks()

		let webhook = webhooks.find((w) => w.owner?.id === container.client.user?.id && w.name === `${container.client.user?.username} Logging`)
		if (!webhook) {
			webhook = await channel.createWebhook(`${container.client.user?.username} Logging`)
		}

		await webhook.send({ embeds: [embed] })
		return true
	}
}

import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction, Guild, GuildMember, User } from 'discord.js'
import ms from 'ms'
import { nanoid } from 'nanoid'
import RainCommand from '../../../structures/RainCommand'
import { ArgsUser } from '../../../types/misc'

@ApplyOptions<CommandOptions>({
	name: 'ban',
	aliases: ['ban'],
	description: 'ban a member',
	preconditions: ['slashOnly', 'permissions', 'GuildOnly'],
	defaultPermissions: 'moderator',
	botPerms: ['BAN_MEMBERS'],
	userDiscordPerms: ['BAN_MEMBERS'],
	slashOptions: {
		guildIDs: ['880637463838724166'],
		idHints: ['938210475534061599'],
		options: [
			{ name: 'member', type: 'USER', description: 'the member you want to ban', required: true },
			{ name: 'reason', type: 'STRING', description: 'the reason to ban them for' },
			{ name: 'time', type: 'STRING', description: 'how long you want them to be banned for' },
			{
				name: 'days',
				type: 'INTEGER',
				description: 'how many days back you want their messages to be deleted for',
				choices: [
					{ name: '1', value: 1 },
					{ name: '2', value: 2 },
					{ name: '3', value: 3 },
					{ name: '4', value: 4 },
					{ name: '5', value: 5 },
					{ name: '6', value: 6 },
					{ name: '7', value: 7 },
				],
			},
		],
	},
})
export class BanCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const args: { member: ArgsUser; reason?: string; time?: string; days?: 1 | 2 | 3 | 4 | 5 | 6 | 7 } = this.parseArgs(interaction)
		if (args.time && ms(args.time) === undefined) {
			return await interaction.reply({ content: "That's not a valid time.", ephemeral: true })
		}
		const time = args.time ? new Date(ms(args.time) + this.container.utils.now('milliseconds')) : undefined
		const target = args.member.member
		const moderator = interaction.member as GuildMember

		if (target) {
			if (this.container.utils.checkPermHeirarchy(await this.container.members.getPerms(target), await this.container.members.getPerms(moderator))) {
				return await interaction.reply({ content: `You can't ban someone with higher or equal permissions to you.`, ephemeral: true })
			}
		}

		// if (this.container.utils.checkPermHeirarchy(await this.container.members.getPerms(target), await this.container.members.getPerms(moderator))) {
		// 	await interaction.reply({ content: `You can't ban someone with higher or equal permissions to you.`, ephemeral: true })
		// }
		// if (!this.container.cache.guilds.get(interaction.guild?.id as string)?.guildSettings.banRole) throw new Error("I can't ban people without having a role set to ban them with.")
		// const banRole = await interaction.guild?.roles.fetch(this.container.cache.guilds.get(interaction.guild?.id as string)?.guildSettings.banRole as string)
		// if (!banRole) throw new Error("I can't ban people without having a role set to ban them with.")

		try {
			await args.member.user.send(
				`You have been banned in **${interaction.guild?.name}**${time ? ` until <t:${Math.floor(time.getTime() / 1000)}:f>` : ''}${args.reason ? ` for ${args.reason}` : '.'}`
			)
		} catch (err) {
			/* do nothing lol */
		}

		let banned: boolean
		time
			? (banned = await this.container.guilds.ban(interaction.guild as Guild, args.member.user, { reason: args.reason }, new Date(time)))
			: (banned = await this.container.guilds.ban(interaction.guild as Guild, args.member.user, { reason: args.reason }))

		if (banned) {
			const id = nanoid()
			await this.container.database.modlogs.create({
				id,
				userId: args.member.user.id,
				guildId: interaction.guildId as string,
				modId: interaction.user.id,
				type: 'BAN',
				reason: args.reason,
				expires: time,
			})

			await interaction.reply({
				content: `I've banned ${args.member.user.tag}${time ? ` until <t:${Math.floor(time.getTime() / 1000)}:F>` : ' forever'},${args.reason ? ` for ${args.reason}` : ' without a reason.'}`,
				ephemeral: true,
			})

			this.container.client.emit('memberBanned', { member: args.member.user, moderator: moderator, reason: args.reason, time, days: args.days, id, guild: interaction.guild })
		} else {
			await interaction.reply({
				content: `Something went wrong while banning ${args.member.user.tag}.`,
				...((await this.container.database.guilds.findByPk(interaction.guild?.id))?.afterPunishmentMessage != null ? {
					embeds: [{color: 'RANDOM', description: `${(await this.container.database.guilds.findByPk(interaction.guild?.id))?.afterPunishmentMessage}` }]
				} : {}),
			})
		}
	}
}

export type MemberBanData = {
	member: User
	moderator: GuildMember
	id: string
	reason?: string
	time?: Date
	days?: 1 | 2 | 3 | 4 | 5 | 6 | 7
	guild: Guild
}

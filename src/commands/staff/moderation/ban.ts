import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction, Guild, GuildMember } from 'discord.js'
import ms from 'ms'
import RainCommand from '../../../structures/RainCommand'
import { ArgsUser } from '../../../types/misc'

@ApplyOptions<CommandOptions>({
	name: 'ban',
	aliases: ['ban'],
	description: 'ban a member',
	preconditions: ['slashOnly', 'permissions', 'GuildOnly'],
	defaultPermissions: 'moderator',
	botPerms: ['BAN_MEMBERS'],
	slashOptions: {
		guildIDs: ['880637463838724166'],
		idHints: ['936396772606111824'],
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
export class banCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const args: { member: ArgsUser; reason?: string; time?: string; days?: 1 | 2 | 3 | 4 | 5 | 6 | 7 } = this.parseArgs(interaction)
		const time = args.time ? ms(args.time) / 1000 + this.container.utils.now() : undefined
		const target = args.member.member
		const moderator = interaction.member as GuildMember

		if (target) {
			if (this.container.utils.checkPermHeirarchy(await this.container.members.getPerms(target), await this.container.members.getPerms(moderator))) {
				await interaction.reply({ content: `You can't ban someone with higher or equal permissions to you.`, ephemeral: true })
			}
		}

		// if (this.container.utils.checkPermHeirarchy(await this.container.members.getPerms(target), await this.container.members.getPerms(moderator))) {
		// 	await interaction.reply({ content: `You can't ban someone with higher or equal permissions to you.`, ephemeral: true })
		// }
		// if (!this.container.cache.guilds.get(interaction.guild?.id as string)?.guildSettings.banRole) throw new Error("I can't ban people without having a role set to ban them with.")
		// const banRole = await interaction.guild?.roles.fetch(this.container.cache.guilds.get(interaction.guild?.id as string)?.guildSettings.banRole as string)
		// if (!banRole) throw new Error("I can't ban people without having a role set to ban them with.")

		try {
			await args.member.user.send(`You have been banned in **${interaction.guild?.name}**${time ? ` until <t:${time}:F>` : ' forever.'}`)
		} catch (err) {
			/* do nothing lol */
		}

		let banned: boolean
		time
			? (banned = await this.container.guilds.ban(interaction.guild as Guild, args.member.user, { reason: args.reason }, time))
			: (banned = await this.container.guilds.ban(interaction.guild as Guild, args.member.user, { reason: args.reason }))

		if (banned) {
			await this.container.users.addModlogEntry(args.member.user, interaction.guild?.id as string, 'BAN', moderator.user.id, {
				reason: args.reason,
				duration: time ? time.toString() : undefined,
			})

			await interaction.reply({
				content: `I've banned ${args.member.user.tag}${time ? ` until <t:${time}:F>` : ' forever'},${args.reason ? ` for ${args.reason}` : ' without a reason.'}`,
				ephemeral: true,
			})

			this.container.client.emit('memberBanned', { member: target, moderator: moderator, reason: args.reason, time, days: args.days })
		} else {
			await interaction.reply({ content: `Something went wrong while muting ${args.member.user.tag}.` })
		}
	}
}

export type MemberBanData = {
	member: GuildMember
	moderator: GuildMember
	reason?: string
	time?: number
}

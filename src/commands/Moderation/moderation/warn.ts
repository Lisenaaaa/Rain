import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction, GuildMember, Snowflake } from 'discord.js'
import RainCommand from '../../../structures/RainCommand'
import { ArgsUser } from '../../../types/misc'

@ApplyOptions<CommandOptions>({
	name: 'warn',
	aliases: ['warn'],
	description: 'warn a member',
	preconditions: ['slashOnly', 'permissions', 'GuildOnly'],
	defaultPermissions: 'helper',
	botPerms: [],
	userDiscordPerms: ['MANAGE_NICKNAMES'],
	slashOptions: {
		guildIDs: ['880637463838724166'],
		idHints: ['938214905469870140'],
		options: [
			{ name: 'member', type: 'USER', description: 'the member you want to warn', required: true },
			{ name: 'reason', type: 'STRING', description: 'the reason to warn them for', required: true },
		],
	},
})
export class WarnCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const args: { member: ArgsUser; reason: string } = this.parseArgs(interaction)
		const target = args.member.member
		const moderator = interaction.member as GuildMember

		this.container.logger.debug('command ran and things parsed')

		if (target) {
			if (this.container.utils.checkPermHeirarchy(await this.container.members.getPerms(target), await this.container.members.getPerms(moderator))) {
				return await interaction.reply({ content: `You can't warn someone with higher or equal permissions to you.`, ephemeral: true })
			}

			this.container.logger.debug('trying to send message')

			let sent
			try {
				await target.user.send(`You have been warned in **${interaction.guild?.name}** for ${args.reason}`)
				sent = true
			} catch (err) {
				sent = false
			}

			if (!sent) {
				this.container.logger.debug("couldn't send message, erroring and adding to modlogs")
				await interaction.reply({ content: `I couldn't DM **${target.user.tag}**, but this has been added to their modlogs.` })
			} else {
				this.container.logger.debug('sent message, telling user and adding to modlogs')
				await interaction.reply({ content: `I've warned **${target.user.tag}** for ${args.reason}` })
			}

			this.container.logger.debug('adding to modlogs')
			await this.container.users.addModlogEntry(target.user, interaction.guild?.id as Snowflake, 'WARN', interaction.user.id, { reason: args.reason })

			await this.container.client.emit('memberWarn', target, interaction.member, args.reason)
		}

		await interaction.reply({ content: `You can't warn someone who isn't on the server.` })
	}
}

export type MemberWarnData = {
	member: GuildMember
	moderator: GuildMember
	reason?: string
}

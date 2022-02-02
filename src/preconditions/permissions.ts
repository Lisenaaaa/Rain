import { ChatInputCommand, container, MessageCommand, Precondition, PreconditionResult } from '@sapphire/framework'
import { CommandInteraction, Guild, GuildMember, Message, TextChannel } from 'discord.js'
import { Perms } from '../types/misc'

export class PermissionsPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction, command: ChatInputCommand) {
		const channel = interaction.channel as TextChannel
		const guild = interaction.guild as Guild
		const member = interaction.member as GuildMember

		return await this.run(guild, channel, member, command.name)
	}

	public override async messageRun(message: Message, command: MessageCommand) {
		const channel = message.channel as TextChannel
		const guild = message.guild as Guild
		const member = message.member as GuildMember

		return await this.run(guild, channel, member, command.name)
	}

	private async run(guild: Guild, channel: TextChannel, member: GuildMember, commandId: string): Promise<PreconditionResult> {
		const db = this.container.cache.guilds.get(guild.id)
		const command = { sapphire: this.container.utils.getCommand(commandId), db: db?.commandSettings.find((c) => c.id === commandId) }
		const channelRequirements = await this.container.channels.getRestrictedPerms(channel) // the permissions the channel needs ('none' if none, `perms` type if some)
		if (channelRequirements === false) {
			throw new Error('Failed to get if a channel is locked to a specific role')
		}

		const commandEnabled = { label: 'Is the command enabled?', value: command.db?.enabled }

		const memberPerms = await this.container.members.getPerms(member) // the member's permissions ('none' if none, `perms` type if some)
		const memberHasPermissionToUseChannel = this.container.utils.checkPermHeirarchy(memberPerms, channelRequirements)

		const runCommandsInChannel = { label: 'Can the member run any commands in this channel?', channelRequirements, memberPerms, value: memberHasPermissionToUseChannel }

		const commandPerms = command.db?.requiredPerms

		const userHasCommandPerms = this.container.utils.checkPermHeirarchy(memberPerms, commandPerms as Perms)

		const runCommand = { label: 'Does the user have permission to run this command?', commandPerms, memberPerms, value: userHasCommandPerms }

		const botPerms = channel.permissionsFor(guild.me as GuildMember).toArray()

		if (!botPerms) {
			return await this.error({ identifier: this.name, message: "Somehow I don't have any perms." })
		}

		const iHavePerms = {
			label: 'Do I have permissions to run this command?',
			botPerms,
			commandPerms: command.sapphire?.options.botPerms,
			value: container.utils.arrayIncludesAllArray(botPerms, command.sapphire?.options.botPerms ?? []),
		}

		container.logger.debug(`${member.user.tag} ran ${commandId}\n`, commandEnabled, runCommandsInChannel, runCommand, iHavePerms, '\n')

		if (!commandEnabled.value) {
			return await this.error({ identifier: 'permissions', message: 'This command is currently disabled.' })
		}

		if (!runCommandsInChannel.value) {
			return await this.error({
				identifier: 'permissions',
				message: `This channel requires you to have ${runCommandsInChannel.channelRequirements} perms to run commands in it, but you ${
					runCommandsInChannel.memberPerms === 'none' ? "don't have any priveliged permissions." : `only have ${runCommandsInChannel.memberPerms}.`
				}`,
			})
		}

		if (!runCommand.value) {
			return await this.error({
				identifier: 'permissions',
				message: `This command requires you to have ${commandPerms} perms, but you ${
					runCommand.memberPerms === 'none' ? "don't have any priveliged permissions." : `only have ${runCommand.memberPerms}.`
				}`,
			})
		}

		if (!iHavePerms.value) {
			return await this.error({
				identifier: this.name,
				message: `I'm missing one or more of these permissions, which are required for me to run this command: ${iHavePerms.commandPerms}`,
			})
		}

		return this.ok()
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		permissions: never
	}
}
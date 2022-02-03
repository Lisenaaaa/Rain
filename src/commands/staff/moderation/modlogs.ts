import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction, MessageEmbedOptions } from 'discord.js'
import RainCommand from '../../../structures/RainCommand'
import { ArgsUser, ModlogDurationTypes, ModlogTypes } from '../../../types/misc'

@ApplyOptions<CommandOptions>({
	name: 'modlogs',
	aliases: ['modlogs'],
	description: "see someone's modlogs",
	preconditions: ['slashOnly', 'permissions', 'GuildOnly'],
	defaultPermissions: 'trialHelper',
	userDiscordPerms: ['MANAGE_MESSAGES'],
	slashOptions: {
		guildIDs: ['880637463838724166'],
		idHints: ['933929396945952779'],
		options: [{ name: 'member', type: 'USER', description: 'the member you want to see the modlogs of', required: true }],
	},
})
export class ModlogsCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const args: { member: ArgsUser } = this.parseArgs(interaction)

		const modlogs = await this.container.users.getModlogs(args.member.user, interaction.guild?.id as string)
		if (modlogs === undefined) return await interaction.reply('That user has no modlogs!')

		const allModlogs = []
		for (const modlog of modlogs) {
			const formattedModlog = `ID: \`${modlog.id}\`\nType: ${modlog.type.toLowerCase()}\nReason: ${modlog.reason}\nModerator: ${await this.container.client.users.fetch(modlog.modID)} (${
				(await this.container.client.users.fetch(modlog.modID)).tag
			})${modlog.duration ? `\nExpires: <t:${modlog.duration}:R>` : `${this.typeIsPunishment(modlog.type) ? '\nExpires: when hell freezes over' : ''}`}\nCreated at <t:${
				modlog.createdTimestamp
			}>`

			allModlogs.push(formattedModlog)
		}

		const newModlogArray = this.container.utils.splitArrayIntoMultiple(allModlogs, 5)
		const embedsArray: MessageEmbedOptions[] = []

		for (const modlogs of newModlogArray) {
			let modlogString = ''
			for (const modlog of modlogs) {
				if (modlogString.length === 0) modlogString += modlog
				else modlogString += `\n-------------------------------------\n${modlog}`
			}

			embedsArray.push({ title: `${args.member.user.tag}'s modlogs`, description: modlogString })
		}

		await this.container.utils.paginate(interaction, embedsArray)
	}

	typeIsPunishment(type: ModlogTypes): type is ModlogDurationTypes {
		const types = ['BAN', 'MUTE']
		return types.includes(type)
	}
}

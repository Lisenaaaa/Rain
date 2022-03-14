import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions, container } from '@sapphire/framework'
import { APIInteractionGuildMember } from 'discord-api-types'
import { CommandInteraction, GuildMember, EmbedBuilder } from 'discord.js'
import RainCommand from '../../structures/RainCommand'

@ApplyOptions<CommandOptions>({
	name: 'help',
	aliases: ['help'],
	description: 'info about my commands',
	preconditions: ['slashOnly', 'permissions'],
	botPerms: ['EmbedLinks'],
	defaultPermissions: 'none',
	slashOptions: {
		guildIDs: ['880637463838724166'],
		idHints: ['944016647092600873'],
	},
})
export class HelpCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const allCommands = HelpCommand.getAllCommands()
		const commandTypes = HelpCommand.getAllCommandCategories()

		const commandsByCategory: Record<string, { name: string; description: string; category: string }[]> = {}
		for (const type of commandTypes) {
			commandsByCategory[type] = allCommands.filter((c) => c.category === type)
		}

		const embed = new EmbedBuilder({ title: 'Rain Help', color: this.getColor(interaction) })

		for (const key of Object.keys(commandsByCategory)) {
			const commands = commandsByCategory[key].map((c) => `\`${c.name}\``).join(', ')
			embed.addFields({name: key, value: commands})
		}

		await interaction.reply({ embeds: [embed] })
	}

	static getAllCommands(): { name: string; description: string; category: string }[] {
		let allCommands = []
		for (const c of container.stores.get('commands')) {
			allCommands.push(c[1])
		}

		allCommands = allCommands.filter((c) => !c.options.preconditions?.includes('ownerOnly'))
		allCommands = allCommands.map((c) => {
			return { name: c.name, description: c.description, category: c.fullCategory[c.fullCategory.length - 1] }
		})

		return allCommands
	}
	static getAllCommandCategories(): Array<string> {
		const commands = HelpCommand.getAllCommands()
		const set = new Set<string>()
		for (const c of commands) {
			set.add(c.category)
		}

		return [...set]
	}
	isMember(member: GuildMember | APIInteractionGuildMember | null): member is GuildMember {
		return member instanceof GuildMember
	}
	getColor(interaction: CommandInteraction) {
		const member = interaction.guild?.members.cache.get(interaction.user.id)
		if (!member) {
			return 0x000000
		}
		return member.displayColor
	}
}

import { ApplyOptions } from '@sapphire/decorators'
import { isGuildBasedChannel } from '@sapphire/discord.js-utilities'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction, Role } from 'discord.js'
import RainCommand from '../../structures/RainCommand'

@ApplyOptions<CommandOptions>({
	name: 'set-owner-role',
	aliases: ['set-owner-role'],
	description: "set the guild's owner role",
	preconditions: ['slashOnly', 'permissions', 'GuildOnly'],
	defaultPermissions: 'none',
	userDiscordPerms: ['MANAGE_GUILD'],
	botPerms: ['MANAGE_MESSAGES'],
	slashOptions: {
		guildIDs: RainCommand.guildIDs(),
		idHints: ['962446409976676372', '966784513583771758'],
		options: [
			{
				name: 'role',
				description: 'the role you want to set',
				type: 'ROLE',
				required: true,
			},
		],
	},
})
export class ConfigCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const { role }: { role: Role } = this.parseArgs(interaction)

		if (interaction.channel === null) {
			return await interaction.reply({
				content: 'how did you even manage to run this not in a channel, and could you please tell my dev about this? discord.gg/jWUNaGgxnB',
			})
		}

		if (interaction.guild === null) {
			return await interaction.reply({ content: 'This must be ran in a text channel on a server.', ephemeral: true })
		}

		if (!this.container.utils.isMember(interaction.member)) {
			return await interaction.reply({ content: 'ok HOW did you manage to run this on a guild without being a member of that guild?????' })
		}

		if (!isGuildBasedChannel(interaction.channel)) {
			return await interaction.reply({ content: 'This must be ran in a text channel on a server.', ephemeral: true })
		}

		if (interaction.guild.ownerId !== interaction.user.id) {
			return await interaction.reply({ content: "You have to be the server's owner to run this command.", ephemeral: true })
		}

		if ((await this.container.database.guilds.findByPk(interaction.guild.id)) === null) {
			await this.container.database.guilds.create({ id: interaction.guild.id })
		}

		await interaction.reply({
			content: `Are you sure you want to set the owner role to ${role.toString()}?`,
			components: [
				{
					type: 'ACTION_ROW',
					components: [
						{ type: 'BUTTON', label: 'Yes', style: 'SUCCESS', customId: 'configSetOwnerRoleYes' },
						{ type: 'BUTTON', label: 'No', style: 'DANGER', customId: 'configSetOwnerRoleNo' },
					],
				},
			],
		})

		const button = await this.container.utils.awaitButton(interaction.user.id, (await interaction.fetchReply()).id, interaction.channel)

		if (!button) {
			return await interaction.editReply({ content: 'does it really take that long to press yes or no?', components: [] })
		}

		if (button.customId === 'configSetOwnerRoleYes') {
			await this.container.database.guilds.update({ ownerRole: role.id }, { where: { id: interaction.guild.id } })

			await interaction.editReply({ content: `Succesfully set this guild's owner role to **${role.toString()}**.`, components: [] })
		} else {
			await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
		}
	}
}

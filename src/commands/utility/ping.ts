import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction, Message } from 'discord.js'
import RainCommand from '../../structures/RainCommand'

@ApplyOptions<CommandOptions>({
	name: 'ping',
	aliases: ['ping'],
	description: 'shows you my current ping',
	preconditions: ['slashOnly', 'permissions'],
	botPerms: ['EMBED_LINKS'],
	defaultPermissions: 'none',
	slashOptions: {
		guildIDs: RainCommand.guildIDs(),
		idHints: ['943289928874352670', '966784600879824896', '967144669874098216'],
	},
})
export class PingCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const msg = (await interaction.reply({ content: 'Pinging...', fetchReply: true })) as Message
		await msg.edit(`Pinging... ${msg.createdTimestamp - interaction.createdTimestamp} ms!`)
	}
}

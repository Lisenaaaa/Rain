import { RainListener } from '@extensions/RainListener'
import Handler from '@functions/handler'
import { Interaction } from 'discord.js'

export default class ButtonListener extends RainListener {
	constructor() {
		super('miscButtonHandler', {
			emitter: 'client',
			event: 'interactionCreate',
		})
	}

	async exec(interaction: Interaction) {
		if (!interaction.isButton()) return

		if (interaction.customId === 'showCommandIDs') {
			let string = ''
			Handler.getAllCommands().forEach((c) => {
				string += `\`${c}\`\n`
			})
			await interaction.reply({ content: string, ephemeral: true })
		}
		if (interaction.customId === 'showPermissions') {
			await interaction.reply({ content: '`owner`, `admin`, `srMod`, `moderator`, `helper`, `trialHelper`, `none`', ephemeral: true })
		}
	}
}

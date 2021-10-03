import { RainCommand } from '@extensions/RainCommand'
import chalk from 'chalk'
import { exec } from 'child_process'
import { ColorResolvable, Message, MessageEmbed } from 'discord.js'
import { promisify } from 'util'

const sh = promisify(exec)

export default class Reload extends RainCommand {
	constructor() {
		super('reload', {
			aliases: ['reload'],
			ownerOnly: true,
			slash: true,
			description: 'reloads the bot, owneronly',
			slashGuilds: ['880637463838724166'],
		})
	}

	async exec(message: Message) {
		const reloadEmbed = new MessageEmbed().setDescription(`Reloading!`).setColor((message.member?.displayColor as ColorResolvable))

		const sent = await message.reply({ embeds: [reloadEmbed] })

		console.log(chalk.greenBright(`Reloading!`))

		await sh('yarn build')

		await this.client.commandHandler.reloadAll()
		await this.client.listenerHandler.reloadAll()
		await this.client.inhibitorHandler.reloadAll()
		await this.client.taskHandler.reloadAll()

		console.log(chalk.green(`Reloaded!\n`))

		reloadEmbed.setDescription(
			`Reloaded! Everything that changed in my files (that are managed by Akairo) should now be loaded in the bot.\n**If you want to reload functions or client stuff, restart the bot**`
		)

		await sent.edit({ embeds: [reloadEmbed] })
	}
}

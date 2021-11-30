import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'

@ApplyOptions<ListenerOptions>({
	once: true,
	event: 'ready',
})
export class ReadyListener extends Listener {
	async run() {
		this.container.logger.info(`Logged in as ${this.container.client.user?.tag}`)
		await this.createSlashCommands()
	}

	async createSlashCommands() {
		// this function will tell the SlashCommandStore to update the global and guild commands
		const slashCommandsStore = this.container.stores.get('slashCommands')

		if (slashCommandsStore) {
			try {
				console.log('Started refreshing application (/) commands.')
				await slashCommandsStore.registerCommands()
				console.log('Successfully reloaded application (/) commands.')
			} catch (err) {
				this.container.logger.fatal(err)
				process.exit()
			}
		}
	}
}

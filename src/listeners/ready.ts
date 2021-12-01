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
				this.container.logger.info('Started reloading slashies.')
				await slashCommandsStore.registerCommands()
				this.container.logger.info('Successfully reloaded slashies.')
			} catch (err) {
				this.container.logger.fatal(err)
				process.exit()
			}
		}
	}
}

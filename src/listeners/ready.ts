import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'

@ApplyOptions<ListenerOptions>({
	once: true,
	event: 'ready',
})
export class ReadyListener extends Listener {
	async run() {
		// await this.createSlashCommands()
		await this.container.cache.guilds.fetchAll()
		this.container.logging.info('Database guild entries cached.')
		this.container.logging.info(`Logged in as ${this.container.client.user?.tag}`, 'magenta')
	}

	// async createSlashCommands() {
	// 	// this function will tell the SlashCommandStore to update the global and guild commands
	// 	const slashCommandsStore = this.container.stores.get('slashCommands')

	// 	if (slashCommandsStore) {
	// 		try {
	// 			this.container.logging.info('Started reloading slashies.')
	// 			await slashCommandsStore.registerCommands()
	// 			this.container.logging.info('Successfully reloaded slashies.')
	// 		} catch (err) {
	// 			this.container.logger.fatal(err)
	// 			process.exit()
	// 		}
	// 	}
	// }
}

import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
// import { initDB } from '../functions/newDatabase'

@ApplyOptions<ListenerOptions>({
	once: true,
	event: 'ready',
})
export class ReadyListener extends Listener {
	async run() {
		await this.container.cache.guilds.fetchAll()
		this.container.logger.info('Database guild entries cached.')
		await this.loadTasks()
		this.container.logger.info(`Logged in as ${this.container.client.user?.tag}`)

		// await initDB()
	}

	async loadTasks() {
		const taskStore = this.container.stores.get('tasks')

		await taskStore.registerTasks()
		this.container.logger.info('Loaded tasks.')
	}

	async loadCommands() {
		for (const [id, guild] of this.container.client.guilds.cache) {
			try {
				await this.container.guilds.registerCommands(guild)
			} catch (err) {
				this.container.logger.warn(`Failed to load commands for the guild ${id}`)
			}
		}
	}
}

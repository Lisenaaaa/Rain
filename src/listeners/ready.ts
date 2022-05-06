import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'

@ApplyOptions<ListenerOptions>({
    once: true,
    event: 'ready',
})
export class ReadyListener extends Listener {
    async run() {
        await this.loadTasks()
        await this.loadCommands()
        this.container.logger.info(`Logged in as ${this.container.client.user?.tag}`)
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

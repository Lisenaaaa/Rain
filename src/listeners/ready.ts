import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions, SapphireClient } from '@sapphire/framework'
import chalk from 'chalk'

@ApplyOptions<ListenerOptions>({
	once: true,
	event: 'ready',
})
export class ReadyListener extends Listener {
	public run() {
		console.log(chalk`{blue Logged in as {bold ${this.container.client.user?.tag}}}`)
	}
}

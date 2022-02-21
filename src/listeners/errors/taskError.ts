import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'

@ApplyOptions<ListenerOptions>({
	event: 'taskError',
})
export class TaskErrorListener extends Listener {
	public async run(error: Error, name: string) {
		await this.container.utils.error(error, {
			type: 'task',
			data: {
				note: name,
			},
		})
	}
}

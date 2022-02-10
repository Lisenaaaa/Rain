import { Store } from '@sapphire/framework'
import { RainTask } from './RainTaskPiece'

export class RainTaskStore extends Store<RainTask> {
	constructor() {
		super(RainTask, { name: 'tasks' })
	}

	async registerTasks() {
		const tasks = this.container.stores.get('tasks')

		for (const [, task] of tasks) {
			if (!task.run) {
				console.error(new Error(`Task ${task.constructor.name} does not have a run method, so it will not be loaded.`))
				continue
			}
			try {
				if (task.runOnStart) {
					await task.run()
				}
				setInterval(task.run, task.delay)
			} catch (err) {
				this.container.client.emit('taskError', err, task.name)
			}
		}
	}
}

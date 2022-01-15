import { Store } from '@sapphire/framework'
import { RainTask } from './RainTaskPiece'

export class RainTaskStore extends Store<RainTask> {
	constructor() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		super(RainTask as any, { name: 'tasks' })
	}

	async registerTasks() {
		const tasks = this.container.stores.get('tasks')

		for (const [, task] of tasks) {
			if (task.runOnStart) {
				await task.run()
			}
			setInterval(task.run, task.delay)
		}
	}
}

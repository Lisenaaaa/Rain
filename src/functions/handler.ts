import { RainCommand } from '@extensions/RainCommand'
import client from '@src/index'

export default class Handler {
	static getCommand(id: string): RainCommand | undefined {
		try {
			client.commandHandler.modules.find((command) => command.id === id)
		} catch (err) {
			return undefined
		}
	}

	static getListener(id: string) {
		return client.listenerHandler.modules.find((listener) => listener.id === id)

		// if (listener === undefined) {
		//     return "Couldn't find listener."
		// }
		// else {
		//     return listener
		// }
	}

	static getInhibitor(id: string) {
		try {
			client.inhibitorHandler.modules.find((inhibitor) => inhibitor.id === id)
		} catch (err) {
			return "Couldn't find command."
		}
	}

	static getTask(id: string) {
		try {
			client.taskHandler.modules.find((task) => task.id === id)
		} catch (err) {
			return "Couldn't find command."
		}
	}

	static getAllCommands() {
		const commandArray: string[] = []

		client.commandHandler.modules.forEach((c) => {
			if (c.ownerOnly) return
			if (c.id === 'helpme') return
			if (c.id.includes('test')) return
			commandArray.push(c.id)
		})

		return commandArray
	}
}

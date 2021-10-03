import client from '@src/index'

export default class Handler {
	static getCommand(id: string) {
		try {
			client.commandHandler.modules.find((command) => command.id === id)
		} catch (err) {
			return "Couldn't find command."
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
}

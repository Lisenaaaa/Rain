import client from '@src/index'

function getCommand(id: string) {
	try {
		client.commandHandler.modules.find((command) => command.id === id)
	} catch (err) {
		return "Couldn't find command."
	}
}
function getListener(id: string) {
	return client.listenerHandler.modules.find((listener) => listener.id === id)

	// if (listener === undefined) {
	//     return "Couldn't find listener."
	// }
	// else {
	//     return listener
	// }
}
function getInhibitor(id: string) {
	try {
		client.inhibitorHandler.modules.find((inhibitor) => inhibitor.id === id)
	} catch (err) {
		return "Couldn't find command."
	}
}
function getTask(id: string) {
	try {
		client.taskHandler.modules.find((task) => task.id === id)
	} catch (err) {
		return "Couldn't find command."
	}
}

export default {
	getCommand,
	getListener,
	getInhibitor,
	getTask,
}

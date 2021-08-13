import client from '@src/index'

function getCommand(id: String) {
	try {
		client.commandHandler.modules.find((command) => command.id === id)
	} catch (err) {
		return "Couldn't find command."
	}
}
function getListener(id: String) {
	return client.listenerHandler.modules.find((listener) => listener.id === id)

	// if (listener === undefined) {
	//     return "Couldn't find listener."
	// }
	// else {
	//     return listener
	// }
}
function getInhibitor(id: String) {
	try {
		client.inhibitorHandler.modules.find((inhibitor) => inhibitor.id === id)
	} catch (err) {
		return "Couldn't find command."
	}
}
function getTask(id: String) {
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

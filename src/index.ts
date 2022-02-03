import config from './config/config'
import { RainClient } from './structures/RainClient'
import Database from './functions/database'
import '@sapphire/plugin-editable-commands/register'

if (process.platform === 'win32') {
	throw new Error('Please use a good OS.')
}

new Database().initDB()

const args = process.argv
args.shift()
args.shift()

const levels = {
	Trace: 10,
	Debug: 20,
	Info: 30,
	Warn: 40,
	Error: 50,
	Fatal: 60,
	None: 100,
}

const level = levels[args[0] as keyof typeof levels] ?? levels['Debug']
const client = new RainClient(level)
void client.login(new config().tokens.main)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validArgs = ['--noPronounDB']

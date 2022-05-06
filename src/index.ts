import * as config from './config/config'
import { RainClient } from './structures/RainClient'
import { Database } from './functions/database'
import '@sapphire/plugin-editable-commands/register'
import { TextDecoder } from 'util'
import { EvalCommand } from './commands/owner/eval'
import chalk from 'chalk'

if (process.platform === 'win32') {
    throw new Error('Please use a good OS.')
}

// prettier adds the semicolon, eslint hates it.
;(async () => {
    await Database.init()
    await Database.connect()
})()

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

const level = levels[args[0] as keyof typeof levels] ?? levels['Info']
const client = new RainClient(level)
void client.login(config.tokens.main)

// const validArgs = ['--noPronounDB']

process.stdin.on('data', async (data: ArrayBuffer) => {
    const code = new TextDecoder().decode(data)
    const ran = await EvalCommand.runCode(code)
    console.log(ran.success ? chalk.green('Code ran succesfully!') : chalk.red('Code errored.'))
    console.log(chalk.magenta(ran.output) + '\n')
})

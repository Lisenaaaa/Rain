import database from '@functions/database'
import config from '@src/config/config'
import chalk from 'chalk'
import { AkairoClient, AkairoHandler, CommandHandler, InhibitorHandler, ListenerHandler, TaskHandler } from 'discord-akairo'
import { Intents, Structures } from 'discord.js'
import ms from 'ms'
import { join } from 'path'
import clientUtils from './ClientUtils'
import { RainChannel } from './discord.js/Channel'
import { RainGuild } from './discord.js/Guild'
import { RainMember } from './discord.js/GuildMember'
import { DRainMessage } from './discord.js/Message'
import { RainUser } from './discord.js/User'

export default class RainClient extends AkairoClient {
	public debug = false

	static preStart() {
		Structures.extend('TextChannel', () => RainChannel)
		Structures.extend('Message', () => DRainMessage)
		Structures.extend('Guild', () => RainGuild)
		Structures.extend('User', () => RainUser)
		Structures.extend('GuildMember', () => RainMember)
	}
	public commandHandler: CommandHandler = new CommandHandler(this, {
		prefix: '-',
		commandUtil: true,
		handleEdits: true,
		directory: join(__dirname, '..', 'commands'),
		allowMention: true,
		automateCategories: true,
		autoRegisterSlashCommands: true,
		autoDefer: false,
	})

	public listenerHandler: ListenerHandler = new ListenerHandler(this, {
		directory: join(__dirname, '..', 'listeners'),
		automateCategories: true,
	})

	public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
		directory: join(__dirname, '..', 'inhibitors'),
	})

	public taskHandler: TaskHandler = new TaskHandler(this, {
		directory: join(__dirname, '..', 'tasks'),
	})

	public database = database
	public utils = clientUtils
	public config = config

	public constructor() {
		super(
			{
				ownerID: ['881310086411190293'],
				intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
			},
			{
				allowedMentions: {
					parse: ['users'],
				},
				intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
			}
		)
	}

	private async _init(): Promise<void> {
		this.commandHandler.useListenerHandler(this.listenerHandler)
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler)
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
			process,
		})
		// loads all the stuff
		const loaders: Record<string, AkairoHandler> = {
			commands: this.commandHandler,
			listeners: this.listenerHandler,
			inhibitors: this.inhibitorHandler,
			tasks: this.taskHandler,
		}
		for (const loader in loaders) {
			try {
				const loader2 = loaders[loader]
				loader2.loadAll()
				if (loader2 instanceof TaskHandler) loader2.startAll()
				console.log(chalk.blueBright(`Successfully loaded ${loader}.`))
			} catch (e) {
				console.error(`Unable to load ${loader} with error ${e}.`)
				process.exit()
			}
		}
	}

	debugLog(name: string, thing: unknown) {
		if (typeof thing === 'string' || typeof thing === 'number' || typeof thing === 'boolean' || typeof thing == 'bigint' || typeof thing == 'undefined')
			console.log(chalk`{red.bold DEBUG/${name}:} ${thing}`)
		else {
			console.log(chalk`{red.bold DEBUG/${name}:}`)
			console.log(thing)
		}
	}

	/**
	 * 
	 * @param time A string that you would like formatted into seconds.
	 * @returns The string you inputted, in seconds.
	 */
	time(time: string): number {
		return Math.round(ms(time)/1000)
	}

	public async start(token: string): Promise<string> {
		await this._init()
		return this.login(token)
	}
}

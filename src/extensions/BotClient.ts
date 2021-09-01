import chalk from 'chalk'
import { AkairoClient, AkairoHandler, CommandHandler, InhibitorHandler, ListenerHandler, TaskHandler } from 'discord-akairo'
import { Intents, Structures } from 'discord.js'
import { join } from 'path'
import database from '@functions/database'
import clientUtils from './ClientUtils'
import config from '@src/config/config'
import { FancyMessage } from '@extensions/discord.js/Message'
import { FancyGuild } from './discord.js/Guild'
import { FancyUser } from './discord.js/User'
import { FancyMember } from './discord.js/GuildMember'

class BotClient extends AkairoClient {
	static preStart() {
		Structures.extend('Message', () => FancyMessage)
		Structures.extend('Guild', () => FancyGuild)
		Structures.extend('User', () => FancyUser)
		Structures.extend('GuildMember', () => FancyMember)
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
		for (const loader of Object.keys(loaders)) {
			try {
				const loader2 = loaders[loader]
				loader2.loadAll()
				if (loader2 instanceof TaskHandler) {
					loader2.startAll?.()
				}
				console.log(chalk.blueBright(`Successfully loaded ${loader}.`))
			} catch (e) {
				console.error(`Unable to load ${loader} with error ${e}.`)
			}
		}
	}

	public async start(token: string): Promise<string> {
		await this._init()
		return this.login(token)
	}
}

export default BotClient

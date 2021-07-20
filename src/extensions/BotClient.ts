import chalk from "chalk"
import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, TaskHandler } from "discord-akairo"
import { Intents, MessageEmbed, TextChannel } from "discord.js"
import { join } from "path"
import database from "@functions/database"
import utils from "@functions/utils"

export class BotClient extends AkairoClient {
	public commandHandler: CommandHandler = new CommandHandler(this, {
		prefix: async (message) => {
			if (message.guild) {
				try {
					return database.add(message.guild.id).then(async () => {
						try {
							return (await database.readGuild(message.guild.id)).guildSettings.prefix
						}
						catch (err) {
							this.listenerHandler.modules.find(listener => listener.id == 'miscErrorListener').exec(err)
							return '-'
						}
					})
				}
				catch (err) {
					this.listenerHandler.modules.find(listener => listener.id == 'miscErrorListener').exec(err)
					return '-'
				}
			}
			else { return '-' }
			//return '-'
		},
		commandUtil: true,
		handleEdits: true,
		directory: join(__dirname, "..", "commands"),
		allowMention: true,
		automateCategories: true,
		autoRegisterSlashCommands: true,
		autoDefer: false,

	})
	public listenerHandler: ListenerHandler = new ListenerHandler(this, {
		directory: join(__dirname, "..", "listeners"),
		automateCategories: true
	})

	public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
		directory: join(__dirname, "..", "inhibitors")
	})

	public taskHandler: TaskHandler = new TaskHandler(this, {
		directory: join(__dirname, "..", "tasks")
	})

	public error(error: Error, type?: string) {
		const errorChannel = this.channels.cache.get('824680761470746646') as TextChannel

		const errorCode = utils.getRandomInt(69696969696969)

		let errorStack = error.stack

		if (errorStack.length > 1000) {
			errorStack = errorStack.substring(0, 1000)
		}

		const errorEmbed = new MessageEmbed()
		if (!type) { errorEmbed.setTitle('An error occured!') }
		else { errorEmbed.setTitle(`A${type} error occured!`) }
		errorEmbed.addField('Error code', `\`${errorCode}\``)
		errorEmbed.setDescription(`\`\`\`js\n${errorStack}\`\`\``)
		errorEmbed.setColor('DARK_RED')

		errorChannel.send({ /*content: `\`\`\`js\n${errorStack}\`\`\``,*/ embeds: [errorEmbed] })

		const returnErrorEmbed = new MessageEmbed()
			.setTitle('An error occured!')
			.setDescription(`Please give my developer code \`${errorCode}\``)
			.setColor('DARK_RED')

		return returnErrorEmbed
	}

	public database = database

	public constructor() {
		super({
			ownerID: [
				"492488074442309642",
				"545277690303741962"
			],
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
		},
			{
				allowedMentions: {
					parse: ["users"]
				},
				intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
			})
	}
	private async _init(): Promise<void> {
		this.commandHandler.useListenerHandler(this.listenerHandler)
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler)
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
			process
		})
		// loads all the stuff
		const loaders = {
			commands: this.commandHandler,
			listeners: this.listenerHandler,
			inhibitors: this.inhibitorHandler,
			tasks: this.taskHandler,
		}
		for (const loader of Object.keys(loaders)) {
			try {
				loaders[loader].loadAll()
				if (loader == 'tasks') { loaders[loader].startAll() }
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
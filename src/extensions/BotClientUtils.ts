// import { AkairoOptions } from "discord-akairo";
// import { MessageEmbed, PermissionResolvable, TextChannel } from "discord.js";
// import BotClient from "@extensions/BotClient"
// import utils from "@functions/utils";

// const client = new BotClient()

// export class BotClientUtils extends BotClient {
// 	declare client: BotClient
// 	usage: string;
// 	discordPerms: PermissionResolvable[];
// 	error: (error: Error, type?: string) => MessageEmbed;

// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 	public constructor(options: ClientOptions) {
// 		super()
// 		this.error = error
// 	}
// }

// const error = (error: Error, type?: string) => {
// 	const errorChannel = client.channels.cache.get('824680761470746646') as TextChannel

// 	const errorCode = utils.getRandomInt(69696969696969)

// 	let errorStack = error.stack

// 	if (errorStack.length > 1000) {
// 		errorStack = errorStack.substring(0, 1000)
// 	}

// 	const errorEmbed = new MessageEmbed()
// 	if (!type) { errorEmbed.setTitle('An error occured!') }
// 	else { errorEmbed.setTitle(`A${type} error occured!`) }
// 	errorEmbed.addField('Error code', `\`${errorCode}\``)
// 	errorEmbed.setDescription(`\`\`\`js\n${errorStack}\`\`\``)
// 	errorEmbed.setColor('DARK_RED')

// 	errorChannel.send({ /*content: `\`\`\`js\n${errorStack}\`\`\``,*/ embeds: [errorEmbed] })

// 	const returnErrorEmbed = new MessageEmbed()
// 		.setTitle('An error occured!')
// 		.setDescription(`Please give my developer code \`${errorCode}\``)
// 		.setColor('DARK_RED')

// 	return returnErrorEmbed
// }

// // eslint-disable-next-line @typescript-eslint/no-empty-interface
// interface ClientOptions extends AkairoOptions {
	
// }
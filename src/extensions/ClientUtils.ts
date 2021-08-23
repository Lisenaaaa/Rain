import { Message, MessageEmbed, TextChannel } from 'discord.js'
import utils from '@functions/utils'
import client from '@src/index'
import { FancyUser } from './discord.js/User'

const error = (error: Error, type?: string, message?: Message) => {
	const errorChannel = client.channels.cache.get(client.config.misc[`${client.config.misc.tokenToUse}errorChannelId` as keyof typeof client.config.misc]) as TextChannel

	const errorCode = utils.getRandomInt(69696969696969)

	let errorStack = error.stack

	if (errorStack?.length as number > 1000) {
		errorStack = errorStack?.substring(0, 1000)
	}

	const errorEmbed = new MessageEmbed()
	if (!type) {
		errorEmbed.setTitle('An error occured!')
	} else {
		errorEmbed.setTitle(`A${type} error occured!`)
	}
	errorEmbed.addField('Error code', `\`${errorCode}\``)
	errorEmbed.setDescription(`\`\`\`js\n${errorStack}\`\`\``)
	errorEmbed.setColor('DARK_RED')

	if (message) {
		errorEmbed.addField(
			'More Info',
			`Guild: ${message.guild?.name} (\`${message.guild?.id}\`)
        Channel: ${(message.channel as TextChannel).name} (\`${message.channel.id}\`)
        Message ID: \`${message.id}\`
        
        Author: ${message.author.tag} (\`${message.author.id}\`)
        
        [Message Link](https://discord.com/channels/${message.guild?.id}/${message.channel.id}/${message.id})`
		)
	}

	errorChannel.send({ /*content: `\`\`\`js\n${errorStack}\`\`\``,*/ embeds: [errorEmbed] })

	const returnErrorEmbed = new MessageEmbed().setTitle('An error occured!').setDescription(`Please give my developer code \`${errorCode}\``).setColor('DARK_RED')

	return returnErrorEmbed
}

const emojis = {
	successAnimated: '<a:CheckMark:874860939411857420>',
	success: '<:success:838816341007269908>',
	faliure: '<:faliure:838816356429332531>',
}

async function fetchUser(user: string) {
	try {
		const akairoResolve = await client.util.resolveUser(user, client.users.cache)

		if (akairoResolve) {
			return akairoResolve as FancyUser
		} else {
			console.log(await client.users.fetch(user))
			return (await client.users.fetch(user)) as FancyUser
		}
	} catch (err) {
		return undefined
	}
}

const flags = {
	userFlags: {
		DISCORD_EMPLOYEE: '<:discord_employee:874817111791398934>',
		PARTNERED_SERVER_OWNER: '<:partnered_server_owner:874817135174635543>',
		HYPESQUAD_EVENTS: '<:hypesquad_events:874817149720465458>',
		BUGHUNTER_LEVEL_1: '<:bughunter_level_1:874817162739589131>',
		HOUSE_BRAVERY: '<:house_bravery:874817174663991346>',
		HOUSE_BRILLIANCE: '<:house_brilliance:874817186336739379>',
		EARLY_SUPPORTER: '<:early_supporter:874817213096415242>',
		BUGHUNTER_LEVEL_2: '<:bughunter_level_2:874817224857235506>',
		EARLY_VERIFIED_BOT_DEVELOPER: '<:early_verified_bot_developer:874817236920045609>',
		DISCORD_CERTIFIED_MODERATOR: '<:never_touched_grass:874817248169197568>',
		HOUSE_BALANCE: '<:house_balance:874817201708879953>',
	},
}

export default {
	error,
	fetchUser,
	flags,
	emojis
}

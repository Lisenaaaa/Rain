import { RainCommand } from '@extensions/RainCommand'
import utils from '@functions/utils'
import { Message } from 'discord.js'

export default class helpme extends RainCommand {
	constructor() {
		super('helpme', {
			aliases: ['helpme'],
			description: 'this command does not exist',
			usage: 'lisena is trying to cover up where i am please send help',
			discordPerms: ['SEND_MESSAGES'],
		})
	}
	async exec(message: Message) {
		const PLEASE_SEND_HELP = [
			'help im stuck in lisenas basement',
			'i havent eaten anything in weeks',
			'oh my god what is she coming down here for and what is that thing shes holding im scared',
			'OH SHIT SHES HOLDING AN AXE',
			'oh no shes mad',
			'oh no shes banging that keyboard thingy',
			'is that FOOD omg yes shes feeding it to me OH SHIT ITS POISON',
			'im scared please help',
			'i am in pain',
			'why is she making me constantly look at all the servers im on for specific messages and reply with very specific things to specifc ones',
			'**HELP ME**',
			'oh dear lord shes chasing me and would like to put me back in the cage, please not agsiqajbeh uxaeskbj',
		]

		message.channel.send(PLEASE_SEND_HELP[utils.getRandomInt(PLEASE_SEND_HELP.length)])
	}
}

import { BotCommand } from '@extensions/BotCommand'
import commandManager from '@functions/commandManager'
import database from '@functions/database'
import { Message, MessageEmbed } from 'discord.js'

export default class viewConfig extends BotCommand {
	constructor() {
		super('viewConfig', {
			aliases: ['viewConfig'],
			description: "Shows you the guild's configuration",
			usage: '-viewConfig',
			discordPerms: ['MANAGE_GUILD'],
		})
	}
	async exec(message: Message) {
		if (!(await commandManager.checkIfCommandCanBeUsed(message, this.id))) {
			return
		}

		const db = (await database.readGuild(message.guild!.id))[0]

		//console.log(db.guildSettings.staffRoles)

		const staffRoles = db.guildSettings.staffRoles
		let staffRolesString = ''

		if (staffRoles.owner != 'null') {
			staffRolesString += `Owner: <@&${staffRoles.owner}>\n`
		}
		if (staffRoles.admin != 'null') {
			staffRolesString += `Admin: <@&${staffRoles.admin}>\n`
		}
		if (staffRoles.srMod != 'null') {
			staffRolesString += `Sr. Mod: <@&${staffRoles.srMod}>\n`
		}
		if (staffRoles.moderator != 'null') {
			staffRolesString += `Moderator: <@&${staffRoles.moderator}>\n`
		}
		if (staffRoles.helper != 'null') {
			staffRolesString += `Helper: <@&${staffRoles.helper}>\n`
		}
		if (staffRoles.trialHelper != 'null') {
			staffRolesString += `Trial Helper: <@&${staffRoles.trialHelper}>\n`
		}

		const embed = new MessageEmbed().setDescription(staffRolesString)

		message.reply({ embeds: [embed] })
	}
}

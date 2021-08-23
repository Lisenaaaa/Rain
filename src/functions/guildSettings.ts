import { Message } from 'discord.js'
import commandManager from '@functions/commandManager'

import database from '@functions/database'
//import utils from "@functions/utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const permNames = {
	owner: 'owner',
	admin: 'administrator',
	srMod: 'senior moderator',
	moderator: 'moderator',
	helper: 'helper',
	trialHelper: 'helper',
}

async function getUserPerms(message: Message) {
	const settings = await database.readGuild(message.guild!.id)

	let found = false
	let perms = 'everyone'

	const roleSettings = settings.guildSettings.staffRoles

	const owner = roleSettings.owner
	const admin = roleSettings.admin
	const srMod = roleSettings.srMod
	const moderator = roleSettings.moderator
	const helper = roleSettings.helper
	const trialHelper = roleSettings.trialHelper

	message.member!.roles.cache.forEach((role) => {
		if (role.id == owner && found == false) {
			found = true
			return (perms = 'owner')
		} else if (role.id == admin && found == false) {
			found = true
			return (perms = 'admin')
		} else if (role.id == srMod && found == false) {
			found = true
			return (perms = 'srMod')
		} else if (role.id == moderator && found == false) {
			found = true
			return (perms = 'moderator')
		} else if (role.id == helper && found == false) {
			found = true
			return (perms = 'helper')
		} else if (role.id == trialHelper && found == false) {
			found = true
			return (perms = 'trialHelper')
		}
	})

	return perms
}

function getAllUserPerms(userPerms: string) {
	if (userPerms == 'everyone') {
		return ['everyone']
	}
	if (userPerms == 'trialHelper') {
		return ['everyone', 'trialHelper']
	}
	if (userPerms == 'helper') {
		return ['everyone', 'trialHelper', 'helper']
	}
	if (userPerms == 'moderator') {
		return ['everyone', 'trialHelper', 'helper', 'moderator']
	}
	if (userPerms == 'srMod') {
		return ['everyone', 'trialHelper', 'helper', 'moderator', 'srMod']
	}
	if (userPerms == 'admin') {
		return ['everyone', 'trialHelper', 'helper', 'moderator', 'srMod', 'admin']
	}
	if (userPerms == 'owner') {
		return ['everyone', 'trialHelper', 'helper', 'moderator', 'srMod', 'admin', 'owner']
	}
}

function checkUserHasPermsForCommand(commandPerms: string, userPerms: string) {
	return getAllUserPerms(userPerms)!.includes(commandPerms)
}

async function checkUserCanUseCommandsInChannel(guildID: string, channelID: string, userPerms: string) {
	let channelPerms = false
	let lockedChannelFound = false
	database.readGuild(guildID).then((database) => {
		const db = database
		const lockedChannels = db.guildSettings.lockedChannels

		getAllUserPerms(userPerms)!.forEach((perm) => {
			lockedChannels.forEach((pain: any) => {
				if (pain.id == perm) {
					if (pain.channels.includes(channelID)) {
						channelPerms = true
						lockedChannelFound = true
					}
				}
			})
		})
	})
	if (lockedChannelFound == false) {
		channelPerms = true
	}

	return channelPerms
}

async function checkUserCanUseSpecificCommand(commandID: string, message: Message) {
	const commandDetails = await commandManager.getCommandDetails(commandID)
	//@ts-ignore
	const discordPerms = message.member!.permissions.has(commandDetails!.discordPerms, true)
	const guildDB = await database.readGuild(message.member!.guild.id)

	let existsInDB = false
	let userHasBotPerms = false

	const fuckYouTypescriptIWantMyCodeRunningInOrder: any = []

	await guildDB.commandSettings.forEach(async (cmd: any) => {
		if (cmd.id == commandID && existsInDB == false) {
			existsInDB = true

			if (cmd.allowedRoles == 'null') {
				existsInDB = false
				userHasBotPerms = false
				return
			}
			const userPerms = getUserPerms(message)

			fuckYouTypescriptIWantMyCodeRunningInOrder.push(userPerms)

			if (await checkUserHasPermsForCommand(cmd.allowedRoles, await userPerms)) {
				userHasBotPerms = true
				return
			}
		}
	})

	return Promise.all(fuckYouTypescriptIWantMyCodeRunningInOrder).then(() => {
		if (existsInDB == false) {
			return discordPerms
		}

		if (existsInDB == true) {
			return userHasBotPerms
		}
	})
}

export default {
	getUserPerms,
	checkUserHasPermsForCommand,
	checkUserCanUseCommandsInChannel,
	checkUserCanUseSpecificCommand,
}

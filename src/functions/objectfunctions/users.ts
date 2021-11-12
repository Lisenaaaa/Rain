import { container } from '@sapphire/pieces'
import { Snowflake, User } from 'discord.js'
import got from 'got/dist/source'
import { nanoid } from 'nanoid'
import { databaseMember } from '../../types/database'
import { modlogTypes, modlogs } from '../../types/misc'

export default class Users {
	isOwner(user: User) {
		return container.config.owners.includes(user.id)
	}

	async getPronouns(
		user: User,
		context: 'details' | 'ownedBy' | 'singular' | 'talkingAbout' = 'details'
	) {
		//all pronouns here are listed in the order they're in on https://pronoundb.org/docs
		const pronounDetails = [
			{ id: 'unspecified', pronoun: 'Unspecified' },
			{ id: 'hh', pronoun: 'he/him' },
			{ id: 'hi', pronoun: 'he/it' },
			{ id: 'hs', pronoun: 'he/she' },
			{ id: 'ht', pronoun: 'he/they' },
			{ id: 'ih', pronoun: 'it/him' },
			{ id: 'ii', pronoun: 'it/its' },
			{ id: 'is', pronoun: 'it/she' },
			{ id: 'it', pronoun: 'it/they' },
			{ id: 'shh', pronoun: 'she/he' },
			{ id: 'sh', pronoun: 'she/her' },
			{ id: 'si', pronoun: 'she/it' },
			{ id: 'st', pronoun: 'she/they' },
			{ id: 'th', pronoun: 'they/he' },
			{ id: 'ti', pronoun: 'they/it' },
			{ id: 'ts', pronoun: 'they/she' },
			{ id: 'tt', pronoun: 'they/them' },
			{ id: 'any', pronoun: 'Any pronouns' },
			{ id: 'other', pronoun: 'Other pronouns' },
			{ id: 'ask', pronoun: 'Ask me my pronouns' },
			{ id: 'avoid', pronoun: 'Avoid pronouns, use my name' },
		]
		const pronounSingular = [
			{ id: 'unspecified', pronoun: 'this person' },
			{ id: 'hh', pronoun: 'he' },
			{ id: 'hi', pronoun: 'he' },
			{ id: 'hs', pronoun: 'he' },
			{ id: 'ht', pronoun: 'he' },
			{ id: 'ih', pronoun: 'it' },
			{ id: 'ii', pronoun: 'it' },
			{ id: 'is', pronoun: 'it' },
			{ id: 'it', pronoun: 'it' },
			{ id: 'shh', pronoun: 'she' },
			{ id: 'sh', pronoun: 'she' },
			{ id: 'si', pronoun: 'she' },
			{ id: 'st', pronoun: 'she' },
			{ id: 'th', pronoun: 'they' },
			{ id: 'ti', pronoun: 'they' },
			{ id: 'ts', pronoun: 'they' },
			{ id: 'tt', pronoun: 'they' },
			{ id: 'any', pronoun: 'this person' },
			{ id: 'other', pronoun: 'this person' },
			{ id: 'ask', pronoun: 'this person' },
			{ id: 'avoid', pronoun: `${user.username}` },
		]
		const pronounDescribe = [
			{ id: 'unspecified', pronoun: `this person` },
			{ id: 'hh', pronoun: `him` },
			{ id: 'hi', pronoun: `him` },
			{ id: 'hs', pronoun: `him` },
			{ id: 'ht', pronoun: `him` },
			{ id: 'ih', pronoun: `it` },
			{ id: 'ii', pronoun: `it` },
			{ id: 'is', pronoun: `it` },
			{ id: 'it', pronoun: `it` },
			{ id: 'shh', pronoun: `her` },
			{ id: 'sh', pronoun: `her` },
			{ id: 'si', pronoun: `her` },
			{ id: 'st', pronoun: `her` },
			{ id: 'th', pronoun: `them` },
			{ id: 'ti', pronoun: `them` },
			{ id: 'ts', pronoun: `them` },
			{ id: 'tt', pronoun: `them` },
			{ id: 'any', pronoun: `this person` },
			{ id: 'other', pronoun: `this person` },
			{ id: 'ask', pronoun: `this person` },
			{ id: 'avoid', pronoun: `${user.username}` },
		]
		const pronounOwnedByPerson = [
			{ id: 'unspecified', pronoun: "this person's" },
			{ id: 'hh', pronoun: 'his' },
			{ id: 'hi', pronoun: 'his' },
			{ id: 'hs', pronoun: 'his' },
			{ id: 'ht', pronoun: 'his' },
			{ id: 'ih', pronoun: "it's" },
			{ id: 'ii', pronoun: "it's" },
			{ id: 'is', pronoun: "it's" },
			{ id: 'it', pronoun: "it's" },
			{ id: 'shh', pronoun: 'her' },
			{ id: 'sh', pronoun: 'her' },
			{ id: 'si', pronoun: 'her' },
			{ id: 'st', pronoun: 'her' },
			{ id: 'th', pronoun: 'their' },
			{ id: 'ti', pronoun: 'their' },
			{ id: 'ts', pronoun: 'their' },
			{ id: 'tt', pronoun: 'their' },
			{ id: 'any', pronoun: "this person's" },
			{ id: 'other', pronoun: "this person's" },
			{ id: 'ask', pronoun: "this person's" },
			{ id: 'avoid', pronoun: `${user.username}'s` },
		]

		try {
			const pronoundb = await got.get(
				`https://pronoundb.org/api/v1/lookup?platform=discord&id=${user.id}`
			)
			const pronouns = JSON.parse(pronoundb.body).pronouns
			//what to return, based on what's getting someone's pronouns
			if (context == 'details') {
				return pronounDetails.find((p) => p.id == pronouns)?.pronoun
			}
			if (context == 'ownedBy') {
				//it is their computer
				return pronounOwnedByPerson.find((p) => p.id == pronouns)?.pronoun
			}
			if (context == 'singular') {
				//they own this computer
				return pronounSingular.find((p) => p.id == pronouns)?.pronoun
			}
			if (context == 'talkingAbout') {
				//this computer belongs to them
				return pronounDescribe.find((p) => p.id == pronouns)?.pronoun
			}
		} catch (err) {
			//if they don't have pronouns set, or if pronoundb is down
			if (err == 'Error: Request failed with status code 404') {
				return undefined
			}
		}
	}

	async addModlogEntry(
		user: User,
		guildID: Snowflake,
		type: modlogTypes,
		moderator: Snowflake,
		data: { reason?: string; duration?: string }
	) {
		const guild = container.client.guilds.cache.get(guildID)
		if (guild === undefined) throw new Error("I couldn't find that guild.")
		if (!type) throw new Error("You can't make a modlog entry without a type!")
		if (!moderator) moderator = user.client.user?.id as string
		const modlogEntry: modlogs = {
			id: nanoid(),
			type: type,
			modID: moderator,
			reason: data.reason ? data.reason : 'No Reason Provided',
			createdTimestamp: Utils.now,
		}

		if (data.duration) modlogEntry.duration = data.duration

		let modlogs = await getModlogs(user, guild.id)

		if (modlogs === undefined) {
			//@ts-ignore what
			const newModlogs: databaseMember = {
				id: this.id,
				modlogs: [],
				muted: { status: false, expires: null },
				banned: { expires: null },
			}
			const dbLogs = await (guild as RainGuild).database('members')
			dbLogs.push(newModlogs)
			const edited = await container.database.guilds.edit(guild.id, 'members', dbLogs)
			if (edited === false) return edited

			modlogs = await getModlogs(user, guild.id)
			modlogs?.push(modlogEntry)
			dbLogs.find((m: databaseMember) => m.id === user.id).modlogs.push(modlogEntry)
			const edited2 = await container.database.guilds.edit(guild.id, 'members', dbLogs)
			return edited2
		}

		modlogs.push(modlogEntry)
		const dbLogs = await (guild as RainGuild).database('members')
		dbLogs.find((m: databaseMember) => m.id === this.id).modlogs.push(modlogEntry)
		const edited = await container.database.guilds.edit(guild.id, 'members', dbLogs)
		return edited
	}

	async getModlogs(user: User, guildID: Snowflake): Promise<modlogs[] | undefined> {
		try {
			const guild = container.client.guilds.cache.get(guildID)
			const logs = (await guild.database('members')).find(
				(m: databaseMember) => m.id === user.id
			)
			if (logs === undefined) return undefined
			else if (logs.modlogs.length === 0) return undefined
			else return logs.modlogs
		} catch (err) {
			return undefined
		}
	}
}

container.users = new Users()
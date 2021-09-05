import { User } from 'discord.js'
import BotClient from '@extensions/BotClient'
import { RawUserData } from 'discord.js/typings/rawDataTypes'
import axios from 'axios'

export class FancyUser extends User {
	declare client: BotClient
	public declare timestamp: number

	public constructor(client: BotClient, options: RawUserData) {
		super(client, options)
		this.timestamp = Math.round(this.createdTimestamp / 1000)
	}

	isOwner() {
		return this.client.ownerID.includes(this.id)
	}

	getBadges() {
		const flags = this.flags?.toArray()
		if (flags === undefined) return []

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return flags.map((f) => this.client.utils.flags.userFlags[f] ?? `\`${f}\``)
	}

	async getPronouns(context: 'details' | 'ownedBy' | 'singular' | 'talkingAbout' = 'details') {
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
			{ id: 'avoid', pronoun: `${this.username}` },
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
			{ id: 'avoid', pronoun: `${this.username}` },
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
			{ id: 'avoid', pronoun: `${this.username}'s` },
		]

		try {
			const pronoundb = await axios(`https://pronoundb.org/api/v1/lookup?platform=discord&id=${this.id}`, { method: 'get' })
			const pronouns = pronoundb.data.pronouns

			//what to return, based on what's getting someone's pronouns
			if (context == 'details') {
				//they/them, etc. mostly used when someone asks "what pronouns does that person use"
				return pronounDetails.find((e) => e.id === pronouns)?.pronoun
			}
			if (context == 'ownedBy') {
				//it is their computer
				return pronounOwnedByPerson.find((e) => e.id === pronouns)?.pronoun
			}
			if (context == 'singular') {
				//they own this computer
				return pronounSingular.find((e) => e.id === pronouns)?.pronoun
			}
			if (context == 'talkingAbout') {
				//this computer belongs to them
				return pronounDescribe.find((e) => e.id === pronouns)?.pronoun
			}
		} catch (err) {
			//if they don't have pronouns set, or if pronoundb is down
			if (err == 'Error: Request failed with status code 404') {
				return undefined
			}
		}
	}
}

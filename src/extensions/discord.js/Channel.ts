import { TextChannel } from 'discord.js'
import { RawGuildChannelData } from 'discord.js/typings/rawDataTypes'
import { RainGuild } from './Guild'

export class RainChannel extends TextChannel {
	public constructor(guild: RainGuild, options: RawGuildChannelData) {
		super(guild, options)
	}

	async isLocked() {
		const channels = (await (this.guild as RainGuild).database())?.guildSettings.lockedChannels

		if (channels?.owner.includes(this.id)) return true
		if (channels?.admin.includes(this.id)) return true
		if (channels?.srMod.includes(this.id)) return true
		if (channels?.moderator.includes(this.id)) return true
		if (channels?.helper.includes(this.id)) return true
		if (channels?.trialHelper.includes(this.id)) return true

		return false
	}

	async getRestrictedPerms(): Promise<string> {
		const channels = (await (this.guild as RainGuild).database())?.guildSettings.lockedChannels

		if (channels?.owner.includes(this.id)) return 'owner'
		else if (channels?.admin.includes(this.id)) return 'admin'
		else if (channels?.srMod.includes(this.id)) return 'srMod'
		else if (channels?.moderator.includes(this.id)) return 'moderator'
		else if (channels?.helper.includes(this.id)) return 'helper'
		else if (channels?.trialHelper.includes(this.id)) return 'trialHelper'
		else return 'none'
	}
}

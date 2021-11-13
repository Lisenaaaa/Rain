import { container } from "@sapphire/pieces";
import { TextChannel } from "discord.js";
import { perms } from "src/types/misc";

export default class Channels {
    async isLocked(channel: TextChannel) {
		const channels = await container.guilds.database(channel.guild, 'guildSettings.lockedChannels')

		if (channels?.owner.includes(channel.id)) return true
		if (channels?.admin.includes(channel.id)) return true
		if (channels?.srMod.includes(channel.id)) return true
		if (channels?.moderator.includes(channel.id)) return true
		if (channels?.helper.includes(channel.id)) return true
		if (channels?.trialHelper.includes(channel.id)) return true

		return false
	}

	async getRestrictedPerms(channel: TextChannel): Promise<perms> {
		const channels = await container.guilds.database(channel.guild, 'guildSettings.lockedChannels')

		if (channels?.owner.includes(channel.id)) return 'owner'
		else if (channels?.admin.includes(channel.id)) return 'admin'
		else if (channels?.srMod.includes(channel.id)) return 'srMod'
		else if (channels?.moderator.includes(channel.id)) return 'moderator'
		else if (channels?.helper.includes(channel.id)) return 'helper'
		else if (channels?.trialHelper.includes(channel.id)) return 'trialHelper'
		else return 'none'
	}
}
import { Guild, GuildMember } from "discord.js"
import BotClient from "@extensions/BotClient"

export class FancyMember extends GuildMember {
	declare client: BotClient

	public constructor(client: BotClient, options: any, guild:Guild) {
        super(client, options, guild)
	}
    
    importantPerms() {
        const permsArray = this.permissions.toArray()
        const importantPerms = [
            'BAN_MEMBERS', 
            'KICK_MEMBERS',
            'MANAGE_CHANNELS',
            'MANAGE_GUILD',
            'VIEW_AUDIT_LOG',
            'PRIORITY_SPEAKER',
            'SEND_TTS_MESSAGES',
            'MENTION_EVERYONE',
            'MUTE_MEMBERS',
            'DEAFEN_MEMBERS',
            'MOVE_MEMBERS',
            'MANAGE_NICKNAMES',
            'MANAGE_WEBHOOKS',
            'MANAGE_EMOJIS_AND_STICKERS',
            'MANAGE_THREADS'
        ]
        let finalArray = permsArray.filter(perm => importantPerms.includes(perm))

        if (permsArray.includes('ADMINISTRATOR')) finalArray = ['ADMINISTRATOR']

        return finalArray
    }
}
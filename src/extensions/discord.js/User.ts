import { User } from "discord.js"
import BotClient from "@extensions/BotClient"

export class FancyUser extends User {
	declare client: BotClient
    public declare timestamp: number

	public constructor(client: BotClient, options: any) {
        super(client, options)
        this.timestamp = Math.round(this.createdTimestamp / 1000)
	}

    isOwner() {
        return this.client.ownerID.includes(this.id)
    }
    
    getBadges() {
        const flags = this.flags?.toArray()
        //const badges: string[] = []
        if (flags === undefined) return []
        // for (const flag of flags) {
        //     if (this.client.utils.flags.userFlags.hasOwnProperty(flag)) {


        //         badges.push(this.client.utils.flags.userFlags[flag as Record<string, string>])


        //     }
        //     else badges.push(flag)
        // }

        //@ts-ignore typescript please go fuck yourself
        const badges = flags.map(f => this.client.utils.flags.userFlags[f] ?? f)
        
        return badges
    }
}
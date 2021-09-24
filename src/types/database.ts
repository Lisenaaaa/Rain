import { Snowflake } from 'discord.js'
import { dbModlogs, guildCommandSettings } from './misc'

export interface GuildDatabase {
    guildID: Snowflake
    guildSettings: {
        welcomeChannel:string,
        welcomeMessage:string,
        loggingChannels:{message:Snowflake|null,member:Snowflake|null,moderation:Snowflake|null,action:Snowflake|null},
        staffRoles:{owner:Snowflake|null,admin:Snowflake|null,srMod:Snowflake|null,moderator:Snowflake|null,helper:Snowflake|null,trialHelper:Snowflake|null},
        lockedChannels:{owner:Snowflake[],admin:Snowflake[],srMod:Snowflake[],moderator:Snowflake[],helper:Snowflake[],trialHelper:Snowflake[]},
        modlogs:dbModlogs[]
    }
    commandSettings: guildCommandSettings[]
    features: {id:string,enabled:boolean}[]
}

export class GuildDatabaseCreator {
    public constructor(options: GuildDatabase) {
        this.guildID = options.guildID
        this.guildSettings = options.guildSettings
        this.commandSettings = options.commandSettings
        this.features = options.features
    }

    public guildID: Snowflake
    public guildSettings: {
        welcomeChannel:string,
        welcomeMessage:string,
        loggingChannels:{message:Snowflake|null,member:Snowflake|null,moderation:Snowflake|null,action:Snowflake|null},
        staffRoles:{owner:Snowflake|null,admin:Snowflake|null,srMod:Snowflake|null,moderator:Snowflake|null,helper:Snowflake|null,trialHelper:Snowflake|null},
        lockedChannels:{owner:Snowflake[],admin:Snowflake[],srMod:Snowflake[],moderator:Snowflake[],helper:Snowflake[],trialHelper:Snowflake[]},
        modlogs:dbModlogs[]
    }
    public commandSettings: guildCommandSettings[]
    public features: {id:string,enabled:boolean}[]
}

export type UserDatabase = {
    userID: Snowflake,
    badges: string[]
}
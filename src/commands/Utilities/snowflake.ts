/** 
Commented out until I finish it.


import { ApplyOptions } from '@sapphire/decorators'
import { SnowflakeRegex } from '@sapphire/discord.js-utilities'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction, GuildMember, SnowflakeUtil, Snowflake } from 'discord.js'
import RainCommand from '../../structures/RainCommand'
import { ArgsSnowflake } from '../../types/misc'

@ApplyOptions<CommandOptions>({
    name: 'snowflake',
    aliases: ['snowflake'],
    description: 'Get info about a snowflake.',
    preconditions: ["slashOnly", "permissions"],
    botPerms: ["EMBED_LINKS"],
    defaultPermissions: 'none',
    slashOptions: {
        options: [
            {
                name: 'snowflake',
                description: 'The snowflake you want info about.',
                type: 'STRING',
                required: true
            },
        ],
    },
})
export class SnowflakeCommand extends RainCommand {
    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.deferReply()
        const args: { snowflake?: ArgsSnowflake } = this.container.utils.parseInteractionArgs(interaction)
        const snowflake = args.snowflake?.snowflake ?? SnowflakeRegex
        console.log(snowflake);
        // idk do something here, get the user data
    }
}

**/
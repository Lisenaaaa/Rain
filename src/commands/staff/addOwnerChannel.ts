import { ApplyOptions } from '@sapphire/decorators'
import { GuildTextBasedChannelTypes, isGuildBasedChannel } from '@sapphire/discord.js-utilities'
import { CommandOptions } from '@sapphire/framework'
import { Channel, CommandInteraction } from 'discord.js'
import RainCommand from '../../structures/RainCommand'
import { PermNames } from '../../types/misc'

@ApplyOptions<CommandOptions>({
    name: 'owner-channel',
    aliases: ['owner-channel'],
    description: 'add or remove an owner only channel',
    preconditions: ['slashOnly', 'permissions', 'GuildOnly'],
    defaultPermissions: 'none',
    userDiscordPerms: ['MANAGE_GUILD'],
    botPerms: ['MANAGE_MESSAGES'],
    slashOptions: {
        guildIDs: RainCommand.guildIDs(),
        idHints: ['966780507268456478', '966784340933636166', '967144410913595492'],
        options: [
            {
                name: 'channel',
                description: 'the channel that you want to manipulate',
                type: 'CHANNEL',
                required: true,
            },
        ],
    },
})
export class ConfigCommand extends RainCommand {
    public override async chatInputRun(interaction: CommandInteraction) {
        const { channel }: { channel: Channel } = this.parseArgs(interaction)

        if (interaction.channel === null) {
            return await interaction.reply({
                content: 'how did you even manage to run this not in a channel, and could you please tell my dev about this? discord.gg/jWUNaGgxnB',
            })
        }

        if (interaction.guild === null) {
            return await interaction.reply({ content: 'This must be ran in a text channel on a server.', ephemeral: true })
        }

        if (!this.container.utils.isMember(interaction.member)) {
            return await interaction.reply({ content: 'ok HOW did you manage to run this on a guild without being a member of that guild?????' })
        }

        if (!isGuildBasedChannel(interaction.channel)) {
            return await interaction.reply({ content: 'This must be ran in a text channel on a server.', ephemeral: true })
        }

        if (interaction.guild.ownerId !== interaction.user.id) {
            return await interaction.reply({ content: "You have to be the server's owner to run this command.", ephemeral: true })
        }

        if ((await this.container.database.guilds.findByPk(interaction.guild.id)) === null) {
            await this.container.database.guilds.create({ id: interaction.guild.id })
        }

        const newChannel = this.container.guilds.findChannel(interaction.guild, channel.id) as GuildTextBasedChannelTypes

        if (newChannel === undefined) {
            return await interaction.reply({ content: "not sure how this happened but that channel doesn't actually exist (or you selected a VC or something idk)" })
        }

        const perms = 'owner'

        await interaction.reply({
            content: `Are you sure that you want to set ${channel.toString()}'s perms to ${PermNames[perms]}?`,
            components: [
                {
                    type: 'ACTION_ROW',
                    components: [
                        { type: 'BUTTON', label: 'Yes', style: 'SUCCESS', customId: 'configSetChannelPermsYes' },
                        { type: 'BUTTON', label: 'No', style: 'DANGER', customId: 'configSetChannelPermsNo' },
                    ],
                },
            ],
        })

        const { id } = await interaction.fetchReply()

        const button = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)
        if (!button) {
            return await interaction.editReply({ content: "I can't tell what you want to do if you don't press a button.", components: [] })
        }

        switch (button.customId) {
            case 'configSetChannelPermsYes': {
                const changed = await this.container.channels.changePerms(newChannel, perms)
                if (!changed) {
                    return await interaction.editReply({ content: `I failed to change ${channel.toString()}'s restricted perms to ${PermNames[perms]}.`, components: [] })
                }

                return await interaction.editReply({ content: `I've succesfully set ${channel.toString()}'s restricted perms to ${PermNames[perms]}.`, components: [] })
            }
            case 'configSetChannelPermsNo': {
                return await interaction.editReply({ content: "Alright. I haven't made any changes.", components: [] })
            }
        }
    }
}

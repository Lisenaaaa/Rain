import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction, GuildMember } from 'discord.js'
import ms from 'ms'
import { nanoid } from 'nanoid'
import { GuildDatabase } from '../../../functions/databases/guild'
import RainCommand from '../../../structures/RainCommand'
import { ArgsUser } from '../../../types/misc'

@ApplyOptions<CommandOptions>({
    name: 'mute',
    aliases: ['mute'],
    description: 'mute a member',
    preconditions: ['slashOnly', 'permissions', 'GuildOnly'],
    defaultPermissions: 'helper',
    botPerms: ['MANAGE_ROLES'],
    userDiscordPerms: ['MANAGE_MESSAGES'],
    slashOptions: {
        guildIDs: RainCommand.guildIDs(),
        idHints: ['933872679654674442', '966784426774253579', '967144496016019456'],
        options: [
            { name: 'member', type: 'USER', description: 'the member you want to mute', required: true },
            { name: 'reason', type: 'STRING', description: 'the reason to mute them for' },
            { name: 'time', type: 'STRING', description: 'the time to mute them for' },
        ],
    },
})
export class MuteCommand extends RainCommand {
    public override async chatInputRun(interaction: CommandInteraction) {
        const args: { member: ArgsUser; reason?: string; time?: string } = this.parseArgs(interaction)
        const time = args.time ? new Date(ms(args.time) + this.container.utils.now('milliseconds')) : undefined
        const target = args.member.member
        const moderator = interaction.member as GuildMember

        if (!target) {
            return await interaction.reply({ content: "I can't mute someone who isn't on the server.", ephemeral: true })
        }

        if (this.container.utils.checkPermHeirarchy(await this.container.members.getPerms(target), await this.container.members.getPerms(moderator))) {
            return await interaction.reply({ content: "You can't mute someone with higher or equal permissions to you.", ephemeral: true })
        }

        const muteRoleId = (await GuildDatabase.findByPk(interaction.guild?.id as string))?.muteRole
        if (!muteRoleId) return await interaction.reply("I can't mute people without having a role set to mute them with.")
        const muteRole = (await GuildDatabase.findByPk(interaction.guildId as string))?.muteRole
        if (!muteRole) return await interaction.reply("I can't mute people without having a role set to mute them with.")

        let muted: boolean
        time ? (muted = await this.container.members.mute(target, time)) : (muted = await this.container.members.mute(target))

        if (muted) {
            const id = nanoid()
            await this.container.database.modlogs.create({
                id,
                userId: target.id,
                guildId: interaction.guildId as string,
                modId: interaction.user.id,
                type: 'MUTE',
                reason: args.reason,
                expires: time,
            })

            try {
                await args.member.user.send({
                    content: `You have been muted in **${interaction.guild?.name}**${time ? ` until <t:${Math.floor(time.getTime() / 1000)}:f>` : ''}${args.reason ? ` for ${args.reason}` : '.'}`,
                    ...((await this.container.database.guilds.findByPk(interaction.guild?.id))?.afterPunishmentMessage != null
                        ? {
                              embeds: [{ color: 'RANDOM', description: `${(await this.container.database.guilds.findByPk(interaction.guild?.id))?.afterPunishmentMessage}` }],
                          }
                        : {}),
                })
            } catch (err) {
                /* do nothing */
            }

            await interaction.reply({
                content: `I've muted ${target.user.tag}${time ? ` until <t:${Math.floor(time.getTime() / 1000)}:F>` : ' forever'},${args.reason ? ` for ${args.reason}` : ' without a reason.'}`,
                ephemeral: true,
            })

            this.container.client.emit('memberMuted', { member: target, moderator: moderator, reason: args.reason, time, id })
        } else {
            await interaction.reply({ content: `Something went wrong while muting ${target.user.tag}.` })
        }
    }
}

export type MemberMuteData = {
    member: GuildMember
    moderator: GuildMember
    reason?: string
    time?: Date
    id: string
}

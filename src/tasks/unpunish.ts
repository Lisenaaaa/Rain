import { PieceContext } from '@sapphire/framework'
import { RainTask } from '../structures/RainTaskPiece'
import { container } from '@sapphire/pieces'
import { GuildMember, Snowflake } from 'discord.js'
import { GuildAttributes } from '../functions/databases/guild'
import { nanoid } from 'nanoid'

export class UnpunishTask extends RainTask {
    constructor(context: PieceContext) {
        super(context, {
            delay: 3 * 1000,
            runOnStart: true,
        })
    }

    override async run() {
        for (const [id, guild] of container.client.guilds.cache) {
            if (!(await container.database.guilds.findByPk(guild.id))) {
                await container.database.guilds.create({ id: guild.id })
            }

            const gDb = (await container.database.guilds.findByPk(guild.id)) as GuildAttributes
            const members = await container.database.members.findAll({ where: { guildId: id } })
            const { muteRole } = gDb

            for (const member of members) {
                /* unmute */
                if (member.muteStatus && member.muteExpires && member.muteExpires.getTime() <= container.utils.now('milliseconds')) {
                    let person: GuildMember | undefined

                    try {
                        person = await guild.members.fetch(member.memberId)
                    } catch (err) {
                        /*do nothing*/
                    }

                    if (person) {
                        if (!muteRole) {
                            return await container.utils.error(new Error('No mute role set.'), {
                                type: 'unmuting a member',
                                data: {},
                            })
                        }

                        container.logger.debug(`unmuting ${person.id} on ${id}`)
                        await container.members.unmute(person)
                        const modlogId = nanoid()
                        await container.database.modlogs.create({
                            id: modlogId,
                            userId: member.memberId,
                            guildId: id,
                            modId: container.client.user?.id as Snowflake,
                            type: 'UNMUTE',
                            reason: 'Automatically unmuted.',
                        })
                        container.client.emit('memberUnmuted', { member: person, moderator: guild.me, reason: 'Automatically unmuted.', id: modlogId })
                        try {
                            await person.send(`You have been automatically unmuted in **${guild.name}**`)
                        } catch (err) {
                            /* do nothing */
                        }
                    }
                }

                /* unban */
                if (member.banExpires != null && member.banExpires.getTime() <= container.utils.now('milliseconds')) {
                    const person = await container.client.users.fetch(member.memberId)
                    if (!(await guild.bans.fetch()).has(person.id)) return
                    await container.guilds.unban(guild, person, 'Punishment expired.')
                    const modlogId = nanoid()
                    await container.database.modlogs.create({
                        id: modlogId,
                        userId: member.memberId,
                        guildId: id,
                        modId: container.client.user?.id as Snowflake,
                        type: 'UNBAN',
                        reason: 'Punishment expired.',
                    })
                    container.client.emit('memberUnbanned', { member: await container.client.users.fetch(member.memberId), moderator: guild.me, reason: 'Automatically unbanned.', id: modlogId })
                    try {
                        await person.send(`You have been automatically unbanned in **${guild.name}**`)
                    } catch (err) {
                        /* do nothing lol */
                    }
                }
            }
        }
    }
}

import { DataTypes, Model } from 'sequelize'
import { Perms } from '../../types/misc'
import { sequelize } from '../database'
import { GuildDatabase } from './guild'

export interface GuildCommandAttributes {
    commandId: string
    guildId: string
    enabled: boolean
    requiredPerms: Perms
}
type GuildCommandCreationAttributes = {
    commandId: string
    guildId: string
    enabled: boolean
    requiredPerms: Perms
}
export class GuildCommandDatabase extends Model<GuildCommandAttributes, GuildCommandCreationAttributes> implements GuildCommandAttributes {
    declare commandId: string
    declare guildId: string
    declare enabled: boolean
    declare requiredPerms: Perms

    static initModel() {
        GuildCommandDatabase.init(
            {
                commandId: { type: DataTypes.STRING, allowNull: false },
                guildId: { type: DataTypes.STRING, allowNull: false, references: { model: GuildDatabase } },
                enabled: { type: DataTypes.BOOLEAN, allowNull: false },
                requiredPerms: { type: DataTypes.STRING, allowNull: false },
            },
            { sequelize, modelName: 'GuildCommands' }
        )
    }
}

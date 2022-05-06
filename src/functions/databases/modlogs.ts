import { DataTypes, Model } from 'sequelize'
import { ModlogTypes } from '../../types/misc'
import { sequelize } from '../database'
import { GuildDatabase } from './guild'

export interface ModlogAttributes {
    id: string
    userId: string
    guildId: string
    modId: string
    type: ModlogTypes
    reason: string | null
    expires: Date | null
}
type ModlogCreationAttributes = {
    id: string
    userId: string
    guildId: string
    modId: string
    type: string
    reason?: string
    expires?: Date
}
export class ModlogDatabase extends Model<ModlogAttributes, ModlogCreationAttributes> implements ModlogAttributes {
    declare id: string
    declare userId: string
    declare guildId: string
    declare modId: string
    declare type: ModlogTypes
    declare reason: string | null
    declare expires: Date | null
    declare readonly createdAt: Date

    static initModel() {
        ModlogDatabase.init(
            {
                id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
                userId: { type: DataTypes.STRING, allowNull: false },
                modId: { type: DataTypes.STRING, allowNull: false },
                guildId: { type: DataTypes.STRING, allowNull: false, references: { model: GuildDatabase } },
                type: { type: DataTypes.STRING, allowNull: false },
                reason: { type: DataTypes.STRING, defaultValue: null },
                expires: { type: DataTypes.DATE, defaultValue: null },
            },
            { sequelize, modelName: 'Modlogs' }
        )
    }
}

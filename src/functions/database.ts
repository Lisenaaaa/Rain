import { container } from '@sapphire/framework'
import { Sequelize } from 'sequelize'
import { database } from '../config/config'
import { CommandDatabase } from './databases/commands'
import { GuildDatabase } from './databases/guild'
import { GuildCommandDatabase } from './databases/guildCommands'
import { MemberDatabase } from './databases/members'
import { ModlogDatabase } from './databases/modlogs'

export const sequelize = new Sequelize(`postgres://${database.user}:${database.password}@${database.host}:${database.port}/${database.databaseName}`, {
    logging: false,
})

export class Database {
    static async connect() {
        try {
            await sequelize.authenticate()
            container.logger.info('Connected to the database.')
        } catch (error) {
            console.error('Unable to connect to the database:', error)
        }
    }

    static async init() {
        GuildDatabase.initModel()
        ModlogDatabase.initModel()
        MemberDatabase.initModel()
        GuildCommandDatabase.initModel()
        CommandDatabase.initModel()

        await sequelize.sync({ alter: true })
    }
}

import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../database'

export interface CommandAttributes {
	id: string
	enabled: boolean
}
type CommandCreationAttributes = Optional<CommandAttributes, 'enabled'>
export class CommandDatabase extends Model<CommandAttributes, CommandCreationAttributes> implements CommandAttributes {
	declare id: string
	declare enabled: boolean

	static initModel() {
		CommandDatabase.init(
			{
				id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
				enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
			},
			{ sequelize, modelName: 'Commands' }
		)
	}
}

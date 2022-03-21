import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../database'

export interface UserAttributes {
	id: string
}
type UserCreationAttributes = {
	id: string
}
export class UserDatabase extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
	declare id: string

	static initModel() {
		UserDatabase.init({ id: { type: DataTypes.STRING, allowNull: false, primaryKey: true } }, { sequelize, modelName: 'Users' })
	}
}

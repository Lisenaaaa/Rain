import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../database'
import { GuildDatabase } from './guild'

export interface MemberAttributes {
	memberId: string
	guildId: string

	muteStatus: boolean
	muteExpires: Date | null

	banExpires: Date | null
}
type MemberCreationAttributes = {
	memberId: string
	guildId: string

	muteStatus?: boolean
	muteExpires?: Date

	banExpires?: Date
}
export class MemberDatabase extends Model<MemberAttributes, MemberCreationAttributes> implements MemberAttributes {
	declare memberId: string
	declare guildId: string

	declare muteStatus: boolean
	declare muteExpires: Date | null

	declare banExpires: Date | null

	static initModel() {
		MemberDatabase.init(
			{
				memberId: { type: DataTypes.STRING, allowNull: false },
				guildId: { type: DataTypes.STRING, allowNull: false, references: { model: GuildDatabase } },

				muteStatus: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
				muteExpires: { type: DataTypes.DATE, allowNull: true, defaultValue: null },

				banExpires: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
			},
			{ sequelize, modelName: 'Members' }
		)
	}
}

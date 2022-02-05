import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../database'
import { GuildDatabase } from './guild'

export interface MemberAttributes {
	memberId: string
	guildId: string

	muteStatus: boolean
	muteExpires: BigInt | null

	banExpires: BigInt | null
}
type MemberCreationAttributes = {
	memberId: string
	guildId: string

	muteStatus?: boolean
	muteExpires?: BigInt | null

	banExpires?: BigInt | null
}
export class MemberDatabase extends Model<MemberAttributes, MemberCreationAttributes> implements MemberAttributes {
	declare memberId: string
	declare guildId: string

	declare muteStatus: boolean
	declare muteExpires: BigInt | null

	declare banExpires: BigInt | null

	static initModel() {
		MemberDatabase.init(
			{
				memberId: { type: DataTypes.STRING, allowNull: false },
				guildId: { type: DataTypes.STRING, allowNull: false, references: { model: GuildDatabase } },

				muteStatus: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
				muteExpires: { type: DataTypes.BIGINT, allowNull: true, defaultValue: null },

				banExpires: { type: DataTypes.BIGINT, allowNull: true, defaultValue: null },
			},
			{ sequelize, modelName: 'Members' }
		)
	}
}

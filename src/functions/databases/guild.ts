import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../database'

export interface GuildAttributes {
	id: string

	welcomeMessage: string | null
	leaveMessage: string | null
	welcomeChannel: string | null
	muteRole: string | null

	messageLoggingChannel: string | null
	memberLoggingChannel: string | null
	moderationLoggingChannel: string | null
	actionLoggingChannel: string | null

	ownerRole: string | null
	adminRole: string | null
	srModRole: string | null
	modRole: string | null
	helperRole: string | null
	trialHelperRole: string | null

	ownerOnlyChannels: string[]
	adminOnlyChannels: string[]
	srModOnlyChannels: string[]
	modOnlyChannels: string[]
	helperOnlyChannels: string[]
	trialHelperOnlyChannels: string[]
}

type GuildCreationAttributes = {
	id: string

	welcomeMessage?: string | null
	leaveMessage?: string | null
	welcomeChannel?: string | null
	muteRole?: string | null

	messageLoggingChanne?: string | null
	memberLoggingChannel?: string | null
	moderationLoggingChannel?: string | null
	actionLoggingChannel?: string | null

	ownerRole?: string | null
	adminRole?: string | null
	srModRole?: string | null
	modRole?: string | null
	helperRole?: string | null
	trialHelperRole?: string | null

	ownerOnlyChannels?: string[]
	adminOnlyChannels?: string[]
	srModOnlyChannels?: string[]
	modOnlyChannels?: string[]
	helperOnlyChannels?: string[]
	trialHelperOnlyChannels?: string[]
}

export class GuildDatabase extends Model<GuildAttributes, GuildCreationAttributes> implements GuildAttributes {
	declare id: string

	declare muteRole: string | null
	declare welcomeMessage: string | null
	declare leaveMessage: string | null
	declare welcomeChannel: string | null

	declare messageLoggingChannel: string | null
	declare memberLoggingChannel: string | null
	declare moderationLoggingChannel: string | null
	declare actionLoggingChannel: string | null

	declare ownerRole: string | null
	declare adminRole: string | null
	declare srModRole: string | null
	declare modRole: string | null
	declare helperRole: string | null
	declare trialHelperRole: string | null

	declare ownerOnlyChannels: string[]
	declare adminOnlyChannels: string[]
	declare srModOnlyChannels: string[]
	declare modOnlyChannels: string[]
	declare helperOnlyChannels: string[]
	declare trialHelperOnlyChannels: string[]

	static initModel() {
		GuildDatabase.init(
			{
				id: {
					type: DataTypes.STRING,
					allowNull: false,
					primaryKey: true,
				},

				muteRole: {
					type: DataTypes.STRING,
					defaultValue: null,
				},
				welcomeMessage: {
					type: DataTypes.STRING,
					defaultValue: null,
				},
				leaveMessage: {
					type: DataTypes.STRING,
					defaultValue: null,
				},
				welcomeChannel: {
					type: DataTypes.STRING,
					defaultValue: null,
				},

				messageLoggingChannel: {
					type: DataTypes.STRING,
					defaultValue: null,
				},
				memberLoggingChannel: {
					type: DataTypes.STRING,
					defaultValue: null,
				},
				moderationLoggingChannel: {
					type: DataTypes.STRING,
					defaultValue: null,
				},
				actionLoggingChannel: {
					type: DataTypes.STRING,
					defaultValue: null,
				},

				ownerRole: {
					type: DataTypes.STRING,
					defaultValue: null,
				},
				adminRole: {
					type: DataTypes.STRING,
					defaultValue: null,
				},
				srModRole: {
					type: DataTypes.STRING,
					defaultValue: null,
				},
				modRole: {
					type: DataTypes.STRING,
					defaultValue: null,
				},
				helperRole: {
					type: DataTypes.STRING,
					defaultValue: null,
				},
				trialHelperRole: {
					type: DataTypes.STRING,
					defaultValue: null,
				},

				ownerOnlyChannels: {
					type: DataTypes.ARRAY(DataTypes.STRING),
					defaultValue: [],
				},
				adminOnlyChannels: {
					type: DataTypes.ARRAY(DataTypes.STRING),
					defaultValue: [],
				},
				srModOnlyChannels: {
					type: DataTypes.ARRAY(DataTypes.STRING),
					defaultValue: [],
				},
				modOnlyChannels: {
					type: DataTypes.ARRAY(DataTypes.STRING),
					defaultValue: [],
				},
				helperOnlyChannels: {
					type: DataTypes.ARRAY(DataTypes.STRING),
					defaultValue: [],
				},
				trialHelperOnlyChannels: {
					type: DataTypes.ARRAY(DataTypes.STRING),
					defaultValue: [],
				},
			},
			{
				sequelize,
				modelName: 'Guilds',
				timestamps: false,
			}
		)
	}
}

import { RainMessage } from '@extensions/akairo/AkairoMessage'
import { RainMember } from '@extensions/discord.js/GuildMember'
import { DRainMessage } from '@extensions/discord.js/Message'
import { RainRole } from '@extensions/discord.js/Role'
import { RainCommand } from '@extensions/RainCommand'
import utils from '@functions/utils'
import { perms } from '@src/types/misc'

export default class SetLogCommand extends RainCommand {
	constructor() {
		super('setStaffRole', {
			aliases: ['setStaffRole'],
			slash: true,
			slashGuilds: utils.slashGuilds,
			description: 'Set a role to be a staff role.',
			slashOptions: [
				{
					name: 'perms',
					type: 'STRING',
					description: 'The staff level you would like to set the role to.',
					choices: [
						{ name: 'owner', value: 'owner' },
						{ name: 'admin', value: 'admin' },
						{ name: 'sr. mod', value: 'srMod' },
						{ name: 'moderator', value: 'moderator' },
						{ name: 'helper', value: 'helper' },
						{ name: 'trial helper', value: 'trialHelper' },
					],
					required: true,
				},
				{
					name: 'role',
					type: 'ROLE',
					description: 'The role you would like to set.',
					required: true,
				},
			],
			defaultPerms: 'srMod',
			discordPerms: ['MANAGE_GUILD'],
			rainPerms: ['SEND_MESSAGES']
		})
	}

	async exec(message: DRainMessage) {
		await message.reply('Please use this as a slashcommand.')
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execSlash(message: RainMessage, { perms, role }: { perms: perms; role: RainRole }) {
		if ((message.member as RainMember).roles.highest.position << role.position && !(message.member as RainMember).isOwner) {
			return await message.reply({ content: "You can't manage that role.", ephemeral: true })
		}

        return await message.reply({content: `${await role.setPerms(perms) ? `I succesfully set **${role.name}** to ${perms}` : `I failed to set **${role.name}** to ${perms}.`}`})
	}
}

import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { GuildMember } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	once: false,
	event: 'guildMemberUpdate',
})
export class MemberUpdateListener extends Listener {
	async run(oldMember: GuildMember, newMember: GuildMember) {
		if (!(await this.container.database.guilds.findByPk(newMember.guild.id))) {
			await this.container.database.guilds.create({ id: newMember.guild.id })
		}

		
	}
}

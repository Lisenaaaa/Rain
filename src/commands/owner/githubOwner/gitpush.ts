import { exec } from 'child_process'
import { Message, MessageEmbed } from 'discord.js'
import { promisify } from 'util'
import { inspect } from 'util'
import { RainCommand } from '@extensions/RainCommand'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sh = promisify(exec)

export default class GitPush extends RainCommand {
	constructor() {
		super('gitPush', {
			aliases: ['gitpush', 'push'],
			args: [
				{
					id: 'commitReason',
					type: 'string',
					match: 'restContent',
				},
			],
			ownerOnly: true,
			channel: 'guild',
			defaultPerms: 'owner'
		})
	}

	async exec(message: Message, args: {commitReason:string}) {
		const gitPushingEmbed = new MessageEmbed().setDescription(`Pushing changes to [GitHub](https://github.com/Lisenaaaaa/Rain)`)
		message.reply({ embeds: [gitPushingEmbed] })

		const githubembed = new MessageEmbed().setTitle(`Command Output`)

		const gitadd = await sh('git add .')
		githubembed.addField(`\`git add .\``, `\`\`\`js\n${inspect(gitadd)}\`\`\``)

		const gitcommit = await sh('git commit -m "${args.commitReason}"')
		githubembed.addField(`\`git commit "${args.commitReason}"\``, `\`\`\`js\n${inspect(gitcommit)}\`\`\``)

		const githubpush = await sh('git push')
		githubembed.addField(`\`git push\``, `\`\`\`js\n${inspect(githubpush)}\`\`\``)

		message.channel.send({ embeds: [githubembed] })
	}
}

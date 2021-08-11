import { Message, MessageEmbed } from 'discord.js'
import { BotCommand } from '@extensions/BotCommand'
import { FancyUser } from '@extensions/discord.js/User'

export default class userInfo extends BotCommand {
    constructor() {
        super('userInfo', {
            aliases: ['userInfo', 'user', 'ui', 'u'],
            args: [{ id: 'person', type: 'string', match: 'rest', default: (message:Message) => message.author as FancyUser }],
            description: 'Shows information about a user.',
            usage: '`-user`, `-user <user>`',
            discordPerms: ['SEND_MESSAGES']
        })
    }
    async exec(message:Message, args:any) {
        //const member = message.guild?.members.fetch(args.person)
        const person = args.person
        const user = await this.client.utils.fetchUser(person) as FancyUser
        if (!user) {return await message.reply('User not found. Try using an ID instead.')}
        const member = await message.guild?.members.cache.get(user.id)

        console.log(user)

        const badges = {
            botOwner: 'botOwner',
            serverOwner: '<:owner:855483985194647642>'
        }

        const userEmbed = new MessageEmbed()
            .setTitle(user.tag)
            .addField('About', `
            Mention: ${user}
            ID: \`${user.id}\`
            Created at: ${user.timestamp}
            `)

        await message.reply({embeds:[userEmbed]})
    }
}
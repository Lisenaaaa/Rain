import { Message, MessageEmbed } from 'discord.js'
import { BotCommand } from '@extensions/BotCommand'

export default class userInfo extends BotCommand {
    constructor() {
        super('userInfo', {
            aliases: ['userInfo', 'user', 'ui', 'u'],
            args: [{ id: 'person', type: 'member', match: 'rest', default: (message:Message) => message.member }],
                description: 'Shows information about a user.',
                usage: '`-user`, `-user <user>`',
                discordPerms: ['SEND_MESSAGES']
            
        })
    }
    async exec(message:Message, args:any) {
        const user = args.person.user
        const member = args.person
        const roles = message.member!.roles.cache

        const badges = {
            botOwner: 'botOwner',
            serverOwner: '<:owner:855483985194647642>'
        }

        let description = ''
        function descriptionAdd(thingToAdd: string) {
            description = description + `${thingToAdd} `
        }

        if (message.guild!.ownerId == user.id) {
            descriptionAdd(badges.serverOwner)
        }
        if (this.client.ownerID.includes(user.id)) {
            descriptionAdd(badges.botOwner)
        }

        const userInfoEmbed = new MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL())
            .setDescription(description)

            .addField('About', `
            Mention: ${user}
            ID: \`${user.id}\`
            `)

        message.channel.send({embeds:[userInfoEmbed]})
        console.log(roles.size-1)
    }
}
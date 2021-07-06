import { MessageEmbed } from 'discord.js';
import { BotCommand } from '@extensions/BotCommand';

export default class userInfo extends BotCommand {
    constructor() {
        super('userInfo', {
            aliases: ['userInfo', 'user', 'ui', 'u'],
            args: [{ id: 'person', type: 'member', match: 'rest', default: message => message.member }],
            description: {
                description: 'Shows information about a user.',
                usage: '`-user`, `-user <user>`',
                defaultPerms: 'none'
            }
        })
    }
    async exec(message, args) {
        const user = args.person.user
        const member = args.person
        const roles = message.member.roles.cache

        const badges = {
            botOwner: 'botOwner',
            serverOwner: '<:owner:855483985194647642>'
        }

        let description = ''
        function descriptionAdd(thingToAdd: string) {
            description = description + `${thingToAdd} `
        }

        if (message.guild.owner.id == user.id) {
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

        message.channel.send(userInfoEmbed)
        console.log(roles.size-1)
    }
}
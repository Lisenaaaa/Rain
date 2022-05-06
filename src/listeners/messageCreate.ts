import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { Message } from 'discord.js'

@ApplyOptions<ListenerOptions>({
    once: false,
    event: 'messageCreate',
})
export class MemberAddListener extends Listener {
    async run(message: Message) {
        await this.yellAtDiscord(message)
    }

    async yellAtDiscord(message: Message) {
        if (message.author.discriminator === '0000' && message.channel.type !== 'DM' && !message.webhookId) {
            if (this.container.utils.random(10) != 10) return

            try {
                // message 1 (index 0) from KAI#1028 on https://optifine.net/discord - https://canary.discord.com/channels/423430686880301056/426005631997181963/938564033030815874
                const array = ['\u200b "I AQHTEW YOU IU HATE YOU DISCOR D YOU SUCK EW I HATE OYU YOU SUCK DISCORD"', 'leave.']
                await message.reply(array[this.container.utils.random(array.length) - 1])
            } catch (err) {
                return
            }
        }
    }
}

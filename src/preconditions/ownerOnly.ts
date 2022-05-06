import { Precondition } from '@sapphire/framework'
import { CommandInteraction, Message, User } from 'discord.js'

export class OwnerOnlyPrecondition extends Precondition {
    public override async messageRun(message: Message) {
        return this.run(message.author)
    }
    public override async chatInputRun(interaction: CommandInteraction) {
        return this.run(interaction.user)
    }

    private run(user: User) {
        return this.container.users.isOwner(user)
            ? this.ok()
            : this.error({
                  identifier: 'ownerOnly',
                  message: `This command can only be used by my developer${this.container.settings.owners.length > 1 ? 's' : ''}.`,
              })
    }
}

declare module '@sapphire/framework' {
    interface Preconditions {
        ownerOnly: never
    }
}

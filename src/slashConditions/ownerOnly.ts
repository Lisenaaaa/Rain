// import { PieceContext } from '@sapphire/pieces'
// import { BaseCommandInteraction } from 'discord.js'
// import { SlashPrecondition } from '../structures/SlashCondition'

// export class OwnerOnlyCondition extends SlashPrecondition {
// 	constructor(context: PieceContext) {
// 		super(context, {
// 			name: 'ownerOnly'
// 		})
// 	}
// 	public async run(interaction: BaseCommandInteraction) {
// 		return this.container.users.isOwner(interaction.user)
// 			? this.ok()
// 			: this.notOk('This command can only be used by my developers.')
// 	}
// }

// declare module '@sapphire/framework' {
// 	interface Preconditions {
// 		slash_ownerOnly: never
// 	}
// }

import { Store } from '@sapphire/framework'
import { Constructor } from '@sapphire/utilities'
import { SlashPrecondition } from './SlashCondition'

export class SlashConditionStore extends Store<SlashPrecondition> {
	constructor() {
		super(SlashPrecondition as Constructor<SlashPrecondition>, { name: 'slashConditions' })
	}
}

import { ApplyOptions } from '@sapphire/decorators'
import { RainTask, RainTaskOptions } from '../structures/RainTaskPiece'

@ApplyOptions<RainTaskOptions>({
	delay: 10 * 1000,
})
export class UnpunishTask extends RainTask {
	async run() {
		console.log(this.container)
	}
}

import { container } from '@sapphire/pieces'
import chalk from 'chalk'
import { chalkColors } from '../types/misc'

export default class Logger {
	public async info(string: string, color?: chalkColors) {
		console.log(
			chalk`{blue [INFO]} {blueBright ${await container.utils.timeFormatted('%F %r')}}: {${
				color ?? 'white'
			} ${string}}`
		)
	}

	public async error(string: string, color?: chalkColors) {
		console.log(
			chalk`{red [ERROR]} {redBright ${await container.utils.timeFormatted('%F %r')}}: {${
				color ?? 'white'
			} ${string}}`
		)
	}
}

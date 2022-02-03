import { container, ILogger, LogLevel } from '@sapphire/framework'
import chalk from 'chalk'
import { ChalkColors } from '../types/misc'

// class OldRainLogger implements ILogger {
// 	public has(level: LogLevel): boolean {
// 		throw new Error('Method not implemented.')
// 	}
// 	public trace(...values: readonly unknown[]): void {
// 		throw new Error('Method not implemented.')
// 	}
// 	public debug(...values: readonly unknown[]): void {
// 		throw new Error('Method not implemented.')
// 	}
// 	public warn(...values: readonly unknown[]): void {
// 		throw new Error('Method not implemented.')
// 	}
// 	public fatal(...values: readonly unknown[]): void {
// 		throw new Error('Method not implemented.')
// 	}
// 	public write(level: LogLevel, ...values: readonly unknown[]): void {
// 		throw new Error('Method not implemented.')
// 	}
// 	public async info(string: string, color?: chalkColors) {
// 		console.log(
// 			chalk`{blue [INFO]} {blueBright ${await container.utils.timeFormatted('%F %r')}}: {${
// 				color ?? 'white'
// 			} ${string}}`
// 		)
// 	}

// 	public async error(string: string, color?: chalkColors) {
// 		console.log(
// 			chalk`{red [ERROR]} {redBright ${await container.utils.timeFormatted('%F %r')}}: {${
// 				color ?? 'white'
// 			} ${string}}`
// 		)
// 	}
// }

export default class RainLogger implements ILogger {
	public level: LogLevel

	public constructor(level: LogLevel) {
		this.level = level
	}

	public has(level: LogLevel): boolean {
		return level >= this.level
	}

	public trace(...values: readonly unknown[]): void {
		this.write(LogLevel.Trace, ...values)
	}

	public debug(...values: readonly unknown[]): void {
		this.write(LogLevel.Debug, ...values)
	}

	public info(...values: readonly unknown[]): void {
		this.write(LogLevel.Info, ...values)
	}

	public warn(...values: readonly unknown[]): void {
		this.write(LogLevel.Warn, ...values)
	}

	public error(...values: readonly unknown[]): void {
		this.write(LogLevel.Error, ...values)
	}

	public fatal(...values: readonly unknown[]): void {
		this.write(LogLevel.Fatal, ...values)
		process.exit()
	}

	public write(level: LogLevel, ...values: readonly unknown[]): void {
		if (!this.has(level)) return
		const method = RainLogger.levels.get(level)
		if (typeof method === 'string') console[method](chalk`{${this.colors.get(method)} [${method.toUpperCase()}]} {${this.colors.get(method)}Bright ${container.utils.timeFormatted()}}:`, ...values)
	}

	protected static readonly levels = new Map<LogLevel, LogMethods>([
		[LogLevel.Trace, 'trace'],
		[LogLevel.Debug, 'debug'],
		[LogLevel.Info, 'info'],
		[LogLevel.Warn, 'warn'],
		[LogLevel.Error, 'error'],
		[LogLevel.Fatal, 'error'],
	])

	protected readonly colors = new Map<LogMethods, ChalkColors>([
		['info', 'blue'],
		['error', 'red'],
		['debug', 'magenta'],
		['warn', 'red'],
		['trace', 'black'],
	])
}

export type LogMethods = 'trace' | 'debug' | 'info' | 'warn' | 'error'

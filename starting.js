(async () => {
	console.log('If you ever come back to this, remember to check if Sapphire and discord.js have had any breaking changes, or if Sapphire has released slashies yet.')
	console.log('src/preconditions/permissions.ts needs finishing!')

	console.log(require('chalk')`{blue [INFO]} {blueBright ${await timeFormatted('%F %r')}}: {white Transpiling TypeScript. This may take some time.}`)
})()

async function timeFormatted(format) {
	return (await require('util').promisify(require('child_process').exec)(`date +'${format ? format : '%A, %b. %d %Y at %I:%M:%S %p'}'`)).stdout.slice(0, -1)
}

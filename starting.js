;(async () => {
	console.log(require('chalk')`{blue [INFO]} {blueBright ${await timeFormatted('%F %r')}}: {white Transpiling TypeScript. This may take some time.}`)
})()

async function timeFormatted(format) {
	return (await require('util').promisify(require('child_process').exec)(`date +'${format ? format : '%A, %b. %d %Y at %I:%M:%S %p'}'`)).stdout.slice(0, -1)
}

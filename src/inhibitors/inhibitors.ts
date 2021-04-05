import { Inhibitor } from "discord-akairo";

class BlacklistInhibitor extends Inhibitor {
	constructor() {
		super("blacklist", {
			reason: "blacklist"
		});
	}

	exec(message) {
		// He's a meanie!
		const blacklist = ["81440962496172032"];
		return blacklist.includes(message.author.id);
	}
}

module.exports = BlacklistInhibitor;
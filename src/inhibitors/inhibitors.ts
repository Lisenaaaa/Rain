import { Inhibitor } from "discord-akairo";

class BlacklistInhibitor extends Inhibitor {
	constructor() {
		super("blacklist", {
			reason: "blacklist"
		});
	}

	exec(message) {
		// He's a meanie!
		const blacklist = ["600875620808785941"];
		return blacklist.includes(message.author.id);
	}
}

module.exports = BlacklistInhibitor;
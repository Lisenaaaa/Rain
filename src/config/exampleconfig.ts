/* 

Copy and paste this, after changing the config values ofc, to `config.ts`, in the same directory.
Also, in `.vscode/settings.json`, re-hide config.ts once you've created it.

*/

export default class config {
	tokens = {
		// Name the token to use "main"
		main: "the bot's token",
	}

	database = {
		pghost: 'localhost', // the IP address, or URL or whatever of the PostgreSQL database.
		pgport: '5432', // The port that database is on. From what I understand, the default is 5432.
		pguser: 'postgres', // The system username that the database is in. By default (at least on arch based systems), this is just 'postgres'.
		pguserpassword: 'password', // That user's password.
		pgdbid: 'databaseName', // The name of the database.
	}
}

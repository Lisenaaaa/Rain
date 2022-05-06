/* 
	Copy and paste this, after changing the config values ofc, to `config.ts`, in the same directory.
*/

export const tokens = {
    // Name the token to use "main"
    main: "the bot's token",
}
export const database = {
    host: 'localhost', // the IP address, or URL or whatever of the PostgreSQL database.
    port: '5432', // The port that database is on. From what I understand, the default is 5432.
    user: 'postgres', // The system username that the database is in. By default (at least on arch based systems), this is just 'postgres'.
    password: 'password', // That user's password.
    databaseName: 'databaseName', // The name of the database.
}
export const errorChannel = '880655558728896562' // The id of the channel to log errors to
export const owners = ['881310086411190293', '545277690303741962'] // The owner IDS of the bot

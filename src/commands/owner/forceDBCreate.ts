import { BotCommand } from "../@extensions/BotCommand"
import utils from '@functions/utils'
import chalk from "chalk";
import database from "@functions/database";

export default class forceDBCreate extends BotCommand {
    constructor() {
        super("forceDBCreate", {
            aliases: ["forceDBCreate"],
            ownerOnly: true
        });
    }


    async exec(message) {
        try {
            let dbconsole
            database.addOverrideOther(message.guild.id).then(e => {
                if (e) {
                    if (e.result.ok == 1) {
                        dbconsole = `Database entry successfully added!`
                        message.util.send(`Database entry successfully added!`)
                    }
                }
                else {
                    dbconsole = `Guild already in DB, so entry was not created.`
                }

                if (dbconsole = `Database entry successfully added!`) {
                    utils.dConsole(`Created database in **${message.guild.name}**, because of a forced creation through a command.`, this.client)
                    console.log(chalk`Created DB in {magenta ${message.guild.name}}, because of forced creation through a command.`)
                }
            })
        }
        catch (err) {
            utils.errorhandling(err, message)
        }
    }
}
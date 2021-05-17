import axios from "axios"
import { BotCommand } from '../../extensions/BotCommand';
import utils from "../../functions/utils";

export default class json extends BotCommand {
    constructor() {
        super('json', {
            aliases: ['json'],
            args: [
                { id: "type", type: "string" },
                { id: "thingtofind", match: "restContent", type: "string" }
            ]
        });
    }

    async exec(message, args) {
        const SkyClientGuilds = [
            `780181693100982273`, //main server
            `824680357936103497` //testing server
        ]
        if (SkyClientGuilds.includes(message.guild.id)) {
            const ModJson = await axios(`https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/mods.json`, { method: "get" })
            const PacksJson = await axios(`https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/packs.json`, { method: "get" })

            if (args.type == `mod`) {
                for (let mod of ModJson.data) {
                    if (mod.id == args.thingtofind) {
                        mod = JSON.stringify(mod, null, '  ')
                        message.channel.send(`${await utils.haste(mod)}`)
                    }
                }
            }
            else if (args.type == `pack`) {
                for (let pack of PacksJson.data) {
                    if (pack.id == args.thingtofind) {
                        pack = JSON.stringify(pack, null, '  ')
                        message.channel.send(`${await utils.haste(pack)}`)
                    }
                }
            }
        }
    }
}
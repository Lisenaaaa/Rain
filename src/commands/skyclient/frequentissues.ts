import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { BotCommand } from "../../extensions/BotCommand";

export default class skyclientfrequentissues extends BotCommand {
    constructor() {
        super("skyclientfrequentissues", {
            aliases: ["skyclientfrequentissues"],
            args: [
                {
                    id: `issue`,
                    type: `string`
                }
            ],
            ownerOnly: true
        });
    }

    async exec(message, args) {
        const SkyClientGuilds = [
            `780181693100982273`, //main server
            `824680357936103497` //testing server
        ]

        if (SkyClientGuilds.includes(message.guild.id)) {
            const windowsbad = new MessageEmbed()
                .setTitle(`I get a "Windows protected your PC" error when trying to install SkyClient!`)
                .setImage(`https://cdn.discordapp.com/attachments/780181693553704973/796869759190827108/unknown.png`)
                .addField(`THIS IS NOT A PROBLEM`, `Click \`More info\`, then \`Run Anyways\` to run it. We would have to pay $300 USD to Microsoft to remove this, and none of the devs are willing to spend that much on an error that means nothing and can be easily bypassed.`)

            const browserbad = new MessageEmbed()
                .setTitle(`Whenever I try to download it, my browser says that it's a virus!`)
                .setImage(`https://cdn.discordapp.com/attachments/785809068610682900/823928836285530162/unknown.png`)
                .addField(`Your browser is bad.`, `The only fix is to use a different browser to download it. [Firefox](https://www.mozilla.org/en-US/firefox/) works, and is (according to Zordlan) better than every other browser.`)

            if (args.issue == `windowsbad`) {
                message.channel.send(windowsbad)
            }
            else if (args.issue == `browserbad`) {
                message.channel.send(browserbad)
            }
            else {
                message.channel.send(`That isn't an issue in <#785809068610682900>! Valid issues: \`windowsbad\`, \`browserbad\``)
            }
        }
        else { return }
    }
}
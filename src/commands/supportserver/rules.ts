import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";

export default class rules extends Command {
    constructor() {
        super("rules", {
            aliases: ["rules", `rule`],
            //ownerOnly: true,
            args: [
                {
                    id: 'rulenumber',
                    type: 'string'
                }
            ]
        });
    }

    exec(message, args) {
        if (message.guild.id === `824680357936103497`) {
            const rule1 = new MessageEmbed()
                .setTitle(`Rule 1: All people are people`)
                .setDescription(`Transphobic, homophobic, racist, xenophobic, hate speech, or anything similar will not be tolerated.\nUsing "gay" as an insult is considered homophobic, and will absolutely not be tolerated.`)
                .addField(`Punishment`, `Instant ban`)
                .setColor(`RED`)

            const rule2 = new MessageEmbed()
                .setTitle(`Rule 2: Don't advertise`)
                .setDescription(`Advertising is cringe, don't do it.`)
                .addField(`Punushment`, `7 day mute`)
                .setColor(`ORANGE`)

            const rule3 = new MessageEmbed()
                .setTitle(`Rule 3: Spamming is cringe`)
                .setDescription(`Don't send repeated messages, don't linebreak, don't send messages that fill people's screen, don't send walls of text, etc.`)
                .addField(`Punishment`, `Varies based on severity`)
                .setColor(`PURPLE`)

            const rule4 = new MessageEmbed()
                .setTitle(`Rule 4: No political discussions`)
                .setDescription(`This isn't the place for politics.`)
                .addField(`Punishment`, `Verbal warning, then if continued, 2 hour mute`)
                .setColor(`PURPLE`)

            const rule5  = new MessageEmbed()
                .setTitle(`Rule 5: No NSFW`)
                .setDescription(`Do I honestly need to explain why this is bad?`)
                .addField(`Punishment`, `Varies based on severity`)
                .setColor(`PURPLE`)

            const rule6 = new MessageEmbed()
                .setTitle(`Staff may moderate at their discretion.`)
                .setDescription(`If a staff member thinks you should be punished, they have the rights to punish you, and what you did isn't against any of the other rules, the staff can still punish you, if they think it's necessary.
                
                Among Us was ruined by the community, and really isn't that funny.`)
                .addField(`Punishment`, `Whatever the staff want, depending on what you did.`)
                .setColor(`BLUE`)


            if (args.rulenumber === `1`) {
                message.channel.send(rule1)
            }
            else if (args.rulenumber === `2`) {
                message.channel.send(rule2)
            }
            else if (args.rulenumber === `3`) {
                message.channel.send(rule3)
            }
            else if (args.rulenumber === `4`) {
                message.channel.send(rule4)
            }
            else if (args.rulenumber === `5`) {
                message.channel.send(rule5)
            }
            else if (args.rulenumber === `6`) {
                message.channel.send(rule6)
            }
            
            else {
                message.channel.send(`Our rules are in <#830528947824492544>, or you can use \`-rule <number from 1 to 5>\` to see individual rules.`)
            }
        }
    }
}
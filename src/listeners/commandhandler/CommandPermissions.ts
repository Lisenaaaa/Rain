import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { BotClient } from "../../extensions/BotClient";
import { BotListener } from "../../extensions/BotListener";

export default class missingPermissions extends BotListener {
    client: BotClient;
    public constructor(client: BotClient) {
        super("missingPermissions", {
            emitter: "commandHandler",
            event: "missingPermissions",
            category: "commandHandler"
        });
        this.client = client;
    }

    exec(message, command, type) {
        const PermsErrorEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Something went wrong!')

        if (type == "user") {
            let perm = command.userPermissions[0]
            PermsErrorEmbed.setDescription(`You cannot run this command, as you don't have \`${perm}\`.`)
        } else {
            let perm = command.clientPermissions[0]
            PermsErrorEmbed.setDescription(`I don't have \`${perm}\`, which I need to have to run this command.`)
        }
        message.channel.send(PermsErrorEmbed)

    }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class BeanCommand extends discord_akairo_1.Command {
    constructor() {
        super('bean', {
            aliases: ['bean'],
            args: [
                {
                    id: 'member',
                    type: 'member'
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'restContent'
                }
            ],
            channel: 'guild'
        });
    }
    async exec(message, args) {
        const ErrorEmbed = new discord_js_1.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Something went wrong!');
        if (!args.member) {
            ErrorEmbed.setDescription('No member found with that name.');
            return message.channel.send(ErrorEmbed);
        }
        if (args.member == 661018000736124948) {
            return message.channel.send('Hey, why did you try to bean me? I don\'t like that.');
        }
        //cant ban zordlan
        /*if (args.member == 492488074442309642) {
            return message.channel.send('no.')
        }*/
        //cant ban nacrt
        /*if (args.member == 435443705055543306) {
            return message.channel.send('no.')
        }*/
        const BanEmbed = new discord_js_1.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('A user has been permanently beaned.')
            .setAuthor(message.author.tag)
            .setTimestamp()
            .addFields({ name: 'Beaned User', value: args.member }, { name: 'Bean Reason', value: args.reason });
        let ErrorEmbedPingAAA = args.member.tag;
        /*args.member.send("You have been banned from " + message.guild.name + " for " + args.reason)
            .then(() => args.member.ban({ reason: message.author.tag + " | " + args.reason }))
            .catch(() => {
                ErrorEmbed.setDescription(`I couldn\'t DM ${ErrorEmbedPingAAA}.`)
                message.channel.send(ErrorEmbed)

                args.member.ban({ reason: message.author.tag + " | " + args.reason })
            })*/
        message.channel.send(BanEmbed);
    }
}
exports.default = BeanCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVhbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9zdGFmZi9tb2RlcmF0aW9uL2JlYW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBeUM7QUFDekMsMkNBQXlDO0FBRXpDLE1BQXFCLFdBQVksU0FBUSx3QkFBTztJQUU1QztRQUNJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDVixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7WUFDakIsSUFBSSxFQUFFO2dCQUNGO29CQUNJLEVBQUUsRUFBRSxRQUFRO29CQUNaLElBQUksRUFBRSxRQUFRO2lCQUNqQjtnQkFDRDtvQkFDSSxFQUFFLEVBQUUsUUFBUTtvQkFDWixJQUFJLEVBQUUsUUFBUTtvQkFDZCxLQUFLLEVBQUUsYUFBYTtpQkFDdkI7YUFDSjtZQUNELE9BQU8sRUFBRSxPQUFPO1NBQ25CLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJO1FBRXBCLE1BQU0sVUFBVSxHQUFHLElBQUkseUJBQVksRUFBRTthQUNoQyxRQUFRLENBQUMsU0FBUyxDQUFDO2FBQ25CLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO1FBRXRDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2QsVUFBVSxDQUFDLGNBQWMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFBO1lBQzVELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7U0FDMUM7UUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksa0JBQWtCLEVBQUU7WUFDbkMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxzREFBc0QsQ0FBQyxDQUFBO1NBQ3RGO1FBRUQsa0JBQWtCO1FBQ2xCOztXQUVHO1FBRUgsZ0JBQWdCO1FBQ2hCOztXQUVHO1FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSx5QkFBWSxFQUFFO2FBQzlCLFFBQVEsQ0FBQyxTQUFTLENBQUM7YUFDbkIsUUFBUSxDQUFDLHFDQUFxQyxDQUFDO2FBQy9DLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUM3QixZQUFZLEVBQUU7YUFDZCxTQUFTLENBQ04sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQzNDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUM5QyxDQUFBO1FBRUwsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQTtRQUV2Qzs7Ozs7OztnQkFPUTtRQUNSLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLENBQUM7Q0FDSjtBQW5FRCw4QkFtRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnZGlzY29yZC1ha2Fpcm8nO1xuaW1wb3J0IHsgTWVzc2FnZUVtYmVkIH0gZnJvbSAnZGlzY29yZC5qcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmVhbkNvbW1hbmQgZXh0ZW5kcyBDb21tYW5kIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcignYmVhbicsIHtcbiAgICAgICAgICAgIGFsaWFzZXM6IFsnYmVhbiddLFxuICAgICAgICAgICAgYXJnczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdtZW1iZXInLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWVtYmVyJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZDogJ3JlYXNvbicsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICBtYXRjaDogJ3Jlc3RDb250ZW50J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBjaGFubmVsOiAnZ3VpbGQnXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGV4ZWMobWVzc2FnZSwgYXJncykge1xuXG4gICAgICAgIGNvbnN0IEVycm9yRW1iZWQgPSBuZXcgTWVzc2FnZUVtYmVkKClcbiAgICAgICAgICAgIC5zZXRDb2xvcignI2ZmMDAwMCcpXG4gICAgICAgICAgICAuc2V0VGl0bGUoJ1NvbWV0aGluZyB3ZW50IHdyb25nIScpXG5cbiAgICAgICAgaWYgKCFhcmdzLm1lbWJlcikge1xuICAgICAgICAgICAgRXJyb3JFbWJlZC5zZXREZXNjcmlwdGlvbignTm8gbWVtYmVyIGZvdW5kIHdpdGggdGhhdCBuYW1lLicpXG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZS5jaGFubmVsLnNlbmQoRXJyb3JFbWJlZClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmdzLm1lbWJlciA9PSA2NjEwMTgwMDA3MzYxMjQ5NDgpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXNzYWdlLmNoYW5uZWwuc2VuZCgnSGV5LCB3aHkgZGlkIHlvdSB0cnkgdG8gYmVhbiBtZT8gSSBkb25cXCd0IGxpa2UgdGhhdC4nKVxuICAgICAgICB9XG5cbiAgICAgICAgLy9jYW50IGJhbiB6b3JkbGFuXG4gICAgICAgIC8qaWYgKGFyZ3MubWVtYmVyID09IDQ5MjQ4ODA3NDQ0MjMwOTY0Mikge1xuICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2UuY2hhbm5lbC5zZW5kKCduby4nKVxuICAgICAgICB9Ki9cblxuICAgICAgICAvL2NhbnQgYmFuIG5hY3J0XG4gICAgICAgIC8qaWYgKGFyZ3MubWVtYmVyID09IDQzNTQ0MzcwNTA1NTU0MzMwNikge1xuICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2UuY2hhbm5lbC5zZW5kKCduby4nKVxuICAgICAgICB9Ki9cblxuICAgICAgICBjb25zdCBCYW5FbWJlZCA9IG5ldyBNZXNzYWdlRW1iZWQoKVxuICAgICAgICAgICAgLnNldENvbG9yKCcjZmYwMDAwJylcbiAgICAgICAgICAgIC5zZXRUaXRsZSgnQSB1c2VyIGhhcyBiZWVuIHBlcm1hbmVudGx5IGJlYW5lZC4nKVxuICAgICAgICAgICAgLnNldEF1dGhvcihtZXNzYWdlLmF1dGhvci50YWcpXG4gICAgICAgICAgICAuc2V0VGltZXN0YW1wKClcbiAgICAgICAgICAgIC5hZGRGaWVsZHMoXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnQmVhbmVkIFVzZXInLCB2YWx1ZTogYXJncy5tZW1iZXIgfSxcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdCZWFuIFJlYXNvbicsIHZhbHVlOiBhcmdzLnJlYXNvbiB9XG4gICAgICAgICAgICApXG5cbiAgICAgICAgbGV0IEVycm9yRW1iZWRQaW5nQUFBID0gYXJncy5tZW1iZXIudGFnXG5cbiAgICAgICAgLyphcmdzLm1lbWJlci5zZW5kKFwiWW91IGhhdmUgYmVlbiBiYW5uZWQgZnJvbSBcIiArIG1lc3NhZ2UuZ3VpbGQubmFtZSArIFwiIGZvciBcIiArIGFyZ3MucmVhc29uKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gYXJncy5tZW1iZXIuYmFuKHsgcmVhc29uOiBtZXNzYWdlLmF1dGhvci50YWcgKyBcIiB8IFwiICsgYXJncy5yZWFzb24gfSkpXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIEVycm9yRW1iZWQuc2V0RGVzY3JpcHRpb24oYEkgY291bGRuXFwndCBETSAke0Vycm9yRW1iZWRQaW5nQUFBfS5gKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2UuY2hhbm5lbC5zZW5kKEVycm9yRW1iZWQpXG5cbiAgICAgICAgICAgICAgICBhcmdzLm1lbWJlci5iYW4oeyByZWFzb246IG1lc3NhZ2UuYXV0aG9yLnRhZyArIFwiIHwgXCIgKyBhcmdzLnJlYXNvbiB9KVxuICAgICAgICAgICAgfSkqL1xuICAgICAgICBtZXNzYWdlLmNoYW5uZWwuc2VuZChCYW5FbWJlZCk7XG4gICAgfVxufVxuIl19
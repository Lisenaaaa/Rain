"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class say extends discord_akairo_1.Command {
    constructor() {
        super('say', {
            aliases: ['say'],
            args: [
                {
                    id: 'say',
                    type: 'string',
                    match: 'text',
                },
                {
                    id: 'channel',
                    match: 'option',
                    flag: '--channel',
                    unordered: true,
                    type: 'channel'
                },
            ],
            channel: 'guild'
        });
    }
    async exec(message, args) {
        if (args.channel) {
            args.channel.send(args.say);
            message.channel.send(`Message sent!`);
            console.log(`Message ${args.say} was sent in ${message.channel.name} on ${message.guild.name} by ${message.author.tag}`);
        }
        else {
            message.channel.send(args.say);
            if (message.deletable) {
                await message.delete();
            }
            console.log(`Message ${args.say} was sent in ${message.channel.name} on ${message.guild.name} by ${message.author.tag}`);
        }
    }
}
exports.default = say;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL293bmVyL3NheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1EQUF5QztBQUV6QyxNQUFxQixHQUFJLFNBQVEsd0JBQU87SUFDcEM7UUFDSSxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQ1QsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ2hCLElBQUksRUFBRTtnQkFDRjtvQkFDSSxFQUFFLEVBQUUsS0FBSztvQkFDVCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxLQUFLLEVBQUUsTUFBTTtpQkFFaEI7Z0JBQ0Q7b0JBQ0ksRUFBRSxFQUFFLFNBQVM7b0JBQ2IsS0FBSyxFQUFFLFFBQVE7b0JBQ2YsSUFBSSxFQUFFLFdBQVc7b0JBQ2pCLFNBQVMsRUFBRSxJQUFJO29CQUNmLElBQUksRUFBRSxTQUFTO2lCQUNsQjthQUNKO1lBQ0QsT0FBTyxFQUFFLE9BQU87U0FDbkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUk7UUFFcEIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQzNCLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO1lBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLENBQUMsR0FBRyxnQkFBZ0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO1NBQzNIO2FBQ0k7WUFDRCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDOUIsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO2dCQUNuQixNQUFNLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQTthQUN6QjtZQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLENBQUMsR0FBRyxnQkFBZ0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO1NBQzNIO0lBQ0wsQ0FBQztDQUNKO0FBdENELHNCQXNDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1hbmQgfSBmcm9tICdkaXNjb3JkLWFrYWlybyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHNheSBleHRlbmRzIENvbW1hbmQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcignc2F5Jywge1xuICAgICAgICAgICAgYWxpYXNlczogWydzYXknXSxcbiAgICAgICAgICAgIGFyZ3M6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAnc2F5JyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoOiAndGV4dCcsXG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdjaGFubmVsJyxcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2g6ICdvcHRpb24nLFxuICAgICAgICAgICAgICAgICAgICBmbGFnOiAnLS1jaGFubmVsJyxcbiAgICAgICAgICAgICAgICAgICAgdW5vcmRlcmVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2hhbm5lbCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGNoYW5uZWw6ICdndWlsZCdcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlYyhtZXNzYWdlLCBhcmdzKSB7XG5cbiAgICAgICAgaWYgKGFyZ3MuY2hhbm5lbCkge1xuICAgICAgICAgICAgYXJncy5jaGFubmVsLnNlbmQoYXJncy5zYXkpXG4gICAgICAgICAgICBtZXNzYWdlLmNoYW5uZWwuc2VuZChgTWVzc2FnZSBzZW50IWApXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgTWVzc2FnZSAke2FyZ3Muc2F5fSB3YXMgc2VudCBpbiAke21lc3NhZ2UuY2hhbm5lbC5uYW1lfSBvbiAke21lc3NhZ2UuZ3VpbGQubmFtZX0gYnkgJHttZXNzYWdlLmF1dGhvci50YWd9YClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1lc3NhZ2UuY2hhbm5lbC5zZW5kKGFyZ3Muc2F5KVxuICAgICAgICAgICAgaWYgKG1lc3NhZ2UuZGVsZXRhYmxlKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgbWVzc2FnZS5kZWxldGUoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coYE1lc3NhZ2UgJHthcmdzLnNheX0gd2FzIHNlbnQgaW4gJHttZXNzYWdlLmNoYW5uZWwubmFtZX0gb24gJHttZXNzYWdlLmd1aWxkLm5hbWV9IGJ5ICR7bWVzc2FnZS5hdXRob3IudGFnfWApXG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
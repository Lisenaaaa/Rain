"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class dm extends discord_akairo_1.Command {
    constructor() {
        super('dm', {
            aliases: ['dm', "dn"],
            args: [
                {
                    id: 'member',
                    type: 'member'
                },
                {
                    id: 'message',
                    type: 'string',
                    match: 'restContent'
                },
            ],
            channel: 'guild'
        });
    }
    async exec(message, args) {
        args.member.send(`${args.message}`);
        message.channel.send(`Message \n${args.message}\n was sent to ${args.member}!`);
    }
}
exports.default = dm;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvb3duZXIvZG0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBeUM7QUFFekMsTUFBcUIsRUFBRyxTQUFRLHdCQUFPO0lBQ25DO1FBQ0ksS0FBSyxDQUFDLElBQUksRUFBRTtZQUNSLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7WUFDckIsSUFBSSxFQUFFO2dCQUNGO29CQUNJLEVBQUUsRUFBRSxRQUFRO29CQUNaLElBQUksRUFBRSxRQUFRO2lCQUNqQjtnQkFDRDtvQkFDSSxFQUFFLEVBQUUsU0FBUztvQkFDYixJQUFJLEVBQUUsUUFBUTtvQkFDZCxLQUFLLEVBQUUsYUFBYTtpQkFDdkI7YUFDSjtZQUNELE9BQU8sRUFBRSxPQUFPO1NBQ25CLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJO1FBRXBCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDcEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsT0FBTyxrQkFBa0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7SUFFbkYsQ0FBQztDQUNKO0FBekJELHFCQXlCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1hbmQgfSBmcm9tICdkaXNjb3JkLWFrYWlybyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGRtIGV4dGVuZHMgQ29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCdkbScsIHtcbiAgICAgICAgICAgIGFsaWFzZXM6IFsnZG0nLCBcImRuXCJdLFxuICAgICAgICAgICAgYXJnczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdtZW1iZXInLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWVtYmVyJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZDogJ21lc3NhZ2UnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2g6ICdyZXN0Q29udGVudCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGNoYW5uZWw6ICdndWlsZCdcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlYyhtZXNzYWdlLCBhcmdzKSB7XG5cbiAgICAgICAgYXJncy5tZW1iZXIuc2VuZChgJHthcmdzLm1lc3NhZ2V9YCk7XG4gICAgICAgIG1lc3NhZ2UuY2hhbm5lbC5zZW5kKGBNZXNzYWdlIFxcbiR7YXJncy5tZXNzYWdlfVxcbiB3YXMgc2VudCB0byAke2FyZ3MubWVtYmVyfSFgKVxuXG4gICAgfVxufVxuIl19
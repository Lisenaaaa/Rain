"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const jsonfile = require('jsonfile');
const file = 'config/global/superusers.json';
class superuser extends discord_akairo_1.Command {
    constructor() {
        super('superuser', {
            aliases: ['superuser'],
            args: [
                {
                    id: 'member',
                    type: 'member'
                }
            ],
            channel: 'guild'
        });
    }
    async exec(message, args) {
        jsonfile.readFile(file)
            .then(superuserfile => {
            const superembed = new discord_js_1.MessageEmbed()
                .setColor("#9c25c4");
            if (superuserfile.superusers.includes(args.member.id)) {
                superuserfile.superusers = superuserfile.superusers.filter(id => id != args.member.id);
                jsonfile.writeFile(file, superuserfile);
                superembed.setDescription(`${args.member} is no longer a superuser.`);
                message.channel.send(superembed);
            }
            else {
                superuserfile.superusers.push(args.member.id);
                jsonfile.writeFile(file, superuserfile);
                superembed.setDescription(`${args.member} is now a superuser.`);
                message.channel.send(superembed);
            }
        })
            .catch(error => console.log(error));
    }
}
exports.default = superuser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwZXJ1c2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL293bmVyL3N1cGVydXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1EQUF5QztBQUN6QywyQ0FBMEM7QUFFMUMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3BDLE1BQU0sSUFBSSxHQUFHLCtCQUErQixDQUFBO0FBRTVDLE1BQXFCLFNBQVUsU0FBUSx3QkFBTztJQUMxQztRQUNJLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDZixPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDdEIsSUFBSSxFQUFFO2dCQUNGO29CQUNJLEVBQUUsRUFBRSxRQUFRO29CQUNaLElBQUksRUFBRSxRQUFRO2lCQUNqQjthQUNKO1lBQ0QsT0FBTyxFQUFFLE9BQU87U0FDbkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUk7UUFFcEIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7YUFDbEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBRWxCLE1BQU0sVUFBVSxHQUFHLElBQUkseUJBQVksRUFBRTtpQkFDcEMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBRXBCLElBQUksYUFBYSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDbkQsYUFBYSxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUN0RixRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQTtnQkFDdkMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLDRCQUE0QixDQUFDLENBQUE7Z0JBQ3JFLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO2FBQ25DO2lCQUVJO2dCQUNELGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7Z0JBQzdDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFBO2dCQUN2QyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sc0JBQXNCLENBQUMsQ0FBQTtnQkFDL0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7YUFDbkM7UUFDTCxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDM0MsQ0FBQztDQUNKO0FBdENELDRCQXNDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1hbmQgfSBmcm9tICdkaXNjb3JkLWFrYWlybyc7XG5pbXBvcnQgeyBNZXNzYWdlRW1iZWQgfSBmcm9tICdkaXNjb3JkLmpzJztcblxuY29uc3QganNvbmZpbGUgPSByZXF1aXJlKCdqc29uZmlsZScpXG5jb25zdCBmaWxlID0gJ2NvbmZpZy9nbG9iYWwvc3VwZXJ1c2Vycy5qc29uJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBzdXBlcnVzZXIgZXh0ZW5kcyBDb21tYW5kIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoJ3N1cGVydXNlcicsIHtcbiAgICAgICAgICAgIGFsaWFzZXM6IFsnc3VwZXJ1c2VyJ10sXG4gICAgICAgICAgICBhcmdzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZDogJ21lbWJlcicsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtZW1iZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGNoYW5uZWw6ICdndWlsZCdcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlYyhtZXNzYWdlLCBhcmdzKSB7XG5cbiAgICAgICAganNvbmZpbGUucmVhZEZpbGUoZmlsZSlcbiAgICAgICAgICAgIC50aGVuKHN1cGVydXNlcmZpbGUgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3VwZXJlbWJlZCA9IG5ldyBNZXNzYWdlRW1iZWQoKVxuICAgICAgICAgICAgICAgIC5zZXRDb2xvcihcIiM5YzI1YzRcIilcblxuICAgICAgICAgICAgICAgIGlmIChzdXBlcnVzZXJmaWxlLnN1cGVydXNlcnMuaW5jbHVkZXMoYXJncy5tZW1iZXIuaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1cGVydXNlcmZpbGUuc3VwZXJ1c2VycyA9IHN1cGVydXNlcmZpbGUuc3VwZXJ1c2Vycy5maWx0ZXIoaWQgPT4gaWQgIT0gYXJncy5tZW1iZXIuaWQpXG4gICAgICAgICAgICAgICAgICAgIGpzb25maWxlLndyaXRlRmlsZShmaWxlLCBzdXBlcnVzZXJmaWxlKVxuICAgICAgICAgICAgICAgICAgICBzdXBlcmVtYmVkLnNldERlc2NyaXB0aW9uKGAke2FyZ3MubWVtYmVyfSBpcyBubyBsb25nZXIgYSBzdXBlcnVzZXIuYClcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS5jaGFubmVsLnNlbmQoc3VwZXJlbWJlZClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3VwZXJ1c2VyZmlsZS5zdXBlcnVzZXJzLnB1c2goYXJncy5tZW1iZXIuaWQpXG4gICAgICAgICAgICAgICAgICAgIGpzb25maWxlLndyaXRlRmlsZShmaWxlLCBzdXBlcnVzZXJmaWxlKVxuICAgICAgICAgICAgICAgICAgICBzdXBlcmVtYmVkLnNldERlc2NyaXB0aW9uKGAke2FyZ3MubWVtYmVyfSBpcyBub3cgYSBzdXBlcnVzZXIuYClcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS5jaGFubmVsLnNlbmQoc3VwZXJlbWJlZClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSlcbiAgICB9XG59XG4iXX0=
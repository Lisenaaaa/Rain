"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const jsonfile = require('jsonfile');
const file = 'src/config/global/superusers.json';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwZXJ1c2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL293bmVyL3N1cGVydXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1EQUF5QztBQUN6QywyQ0FBMEM7QUFFMUMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3BDLE1BQU0sSUFBSSxHQUFHLG1DQUFtQyxDQUFBO0FBRWhELE1BQXFCLFNBQVUsU0FBUSx3QkFBTztJQUMxQztRQUNJLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDZixPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDdEIsSUFBSSxFQUFFO2dCQUNGO29CQUNJLEVBQUUsRUFBRSxRQUFRO29CQUNaLElBQUksRUFBRSxRQUFRO2lCQUNqQjthQUNKO1lBQ0QsT0FBTyxFQUFFLE9BQU87U0FDbkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUk7UUFFcEIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7YUFDbEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBRWxCLE1BQU0sVUFBVSxHQUFHLElBQUkseUJBQVksRUFBRTtpQkFDcEMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBRXBCLElBQUksYUFBYSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDbkQsYUFBYSxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUN0RixRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQTtnQkFDdkMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLDRCQUE0QixDQUFDLENBQUE7Z0JBQ3JFLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO2FBQ25DO2lCQUVJO2dCQUNELGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7Z0JBQzdDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFBO2dCQUN2QyxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sc0JBQXNCLENBQUMsQ0FBQTtnQkFDL0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7YUFDbkM7UUFDTCxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDM0MsQ0FBQztDQUNKO0FBdENELDRCQXNDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1hbmQgfSBmcm9tICdkaXNjb3JkLWFrYWlybyc7XG5pbXBvcnQgeyBNZXNzYWdlRW1iZWQgfSBmcm9tICdkaXNjb3JkLmpzJztcblxuY29uc3QganNvbmZpbGUgPSByZXF1aXJlKCdqc29uZmlsZScpXG5jb25zdCBmaWxlID0gJ3NyYy9jb25maWcvZ2xvYmFsL3N1cGVydXNlcnMuanNvbidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mgc3VwZXJ1c2VyIGV4dGVuZHMgQ29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCdzdXBlcnVzZXInLCB7XG4gICAgICAgICAgICBhbGlhc2VzOiBbJ3N1cGVydXNlciddLFxuICAgICAgICAgICAgYXJnczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdtZW1iZXInLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWVtYmVyJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBjaGFubmVsOiAnZ3VpbGQnXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGV4ZWMobWVzc2FnZSwgYXJncykge1xuXG4gICAgICAgIGpzb25maWxlLnJlYWRGaWxlKGZpbGUpXG4gICAgICAgICAgICAudGhlbihzdXBlcnVzZXJmaWxlID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHN1cGVyZW1iZWQgPSBuZXcgTWVzc2FnZUVtYmVkKClcbiAgICAgICAgICAgICAgICAuc2V0Q29sb3IoXCIjOWMyNWM0XCIpXG5cbiAgICAgICAgICAgICAgICBpZiAoc3VwZXJ1c2VyZmlsZS5zdXBlcnVzZXJzLmluY2x1ZGVzKGFyZ3MubWVtYmVyLmlkKSkge1xuICAgICAgICAgICAgICAgICAgICBzdXBlcnVzZXJmaWxlLnN1cGVydXNlcnMgPSBzdXBlcnVzZXJmaWxlLnN1cGVydXNlcnMuZmlsdGVyKGlkID0+IGlkICE9IGFyZ3MubWVtYmVyLmlkKVxuICAgICAgICAgICAgICAgICAgICBqc29uZmlsZS53cml0ZUZpbGUoZmlsZSwgc3VwZXJ1c2VyZmlsZSlcbiAgICAgICAgICAgICAgICAgICAgc3VwZXJlbWJlZC5zZXREZXNjcmlwdGlvbihgJHthcmdzLm1lbWJlcn0gaXMgbm8gbG9uZ2VyIGEgc3VwZXJ1c2VyLmApXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UuY2hhbm5lbC5zZW5kKHN1cGVyZW1iZWQpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN1cGVydXNlcmZpbGUuc3VwZXJ1c2Vycy5wdXNoKGFyZ3MubWVtYmVyLmlkKVxuICAgICAgICAgICAgICAgICAgICBqc29uZmlsZS53cml0ZUZpbGUoZmlsZSwgc3VwZXJ1c2VyZmlsZSlcbiAgICAgICAgICAgICAgICAgICAgc3VwZXJlbWJlZC5zZXREZXNjcmlwdGlvbihgJHthcmdzLm1lbWJlcn0gaXMgbm93IGEgc3VwZXJ1c2VyLmApXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UuY2hhbm5lbC5zZW5kKHN1cGVyZW1iZWQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmxvZyhlcnJvcikpXG4gICAgfVxufVxuIl19
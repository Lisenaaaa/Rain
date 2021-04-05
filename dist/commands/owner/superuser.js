"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
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
            if (superuserfile.superusers.includes(args.member.id)) {
                message.channel.send("that member is already a superuser, so i did nothing");
            }
            // else if (they're already in the file) {
            //     remove them from the file
            // }
            else {
                superuserfile.superusers.push(args.member.id);
                jsonfile.writeFile(file, superuserfile);
                message.channel.send(`${args.member} is now a superuser.`);
            }
            console.log(superuserfile);
        })
            .catch(error => console.log(error));
    }
}
exports.default = superuser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwZXJ1c2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL293bmVyL3N1cGVydXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1EQUF5QztBQUV6QyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDcEMsTUFBTSxJQUFJLEdBQUcsbUNBQW1DLENBQUE7QUFFaEQsTUFBcUIsU0FBVSxTQUFRLHdCQUFPO0lBQzFDO1FBQ0ksS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUNmLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQztZQUN0QixJQUFJLEVBQUU7Z0JBQ0Y7b0JBQ0ksRUFBRSxFQUFFLFFBQVE7b0JBQ1osSUFBSSxFQUFFLFFBQVE7aUJBQ2pCO2FBQ0o7WUFDRCxPQUFPLEVBQUUsT0FBTztTQUNuQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSTtRQUVwQixRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzthQUNsQixJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFFbEIsSUFBSSxhQUFhLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUNuRCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxzREFBc0QsQ0FBQyxDQUFBO2FBQy9FO1lBRUQsMENBQTBDO1lBQzFDLGdDQUFnQztZQUNoQyxJQUFJO2lCQUVDO2dCQUNELGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7Z0JBQzdDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFBO2dCQUN2QyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLHNCQUFzQixDQUFDLENBQUE7YUFDN0Q7WUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBQzlCLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUMzQyxDQUFDO0NBQ0o7QUFyQ0QsNEJBcUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJ2Rpc2NvcmQtYWthaXJvJztcblxuY29uc3QganNvbmZpbGUgPSByZXF1aXJlKCdqc29uZmlsZScpXG5jb25zdCBmaWxlID0gJ3NyYy9jb25maWcvZ2xvYmFsL3N1cGVydXNlcnMuanNvbidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mgc3VwZXJ1c2VyIGV4dGVuZHMgQ29tbWFuZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCdzdXBlcnVzZXInLCB7XG4gICAgICAgICAgICBhbGlhc2VzOiBbJ3N1cGVydXNlciddLFxuICAgICAgICAgICAgYXJnczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdtZW1iZXInLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWVtYmVyJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBjaGFubmVsOiAnZ3VpbGQnXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGV4ZWMobWVzc2FnZSwgYXJncykge1xuXG4gICAgICAgIGpzb25maWxlLnJlYWRGaWxlKGZpbGUpXG4gICAgICAgICAgICAudGhlbihzdXBlcnVzZXJmaWxlID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChzdXBlcnVzZXJmaWxlLnN1cGVydXNlcnMuaW5jbHVkZXMoYXJncy5tZW1iZXIuaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UuY2hhbm5lbC5zZW5kKFwidGhhdCBtZW1iZXIgaXMgYWxyZWFkeSBhIHN1cGVydXNlciwgc28gaSBkaWQgbm90aGluZ1wiKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGVsc2UgaWYgKHRoZXkncmUgYWxyZWFkeSBpbiB0aGUgZmlsZSkge1xuICAgICAgICAgICAgICAgIC8vICAgICByZW1vdmUgdGhlbSBmcm9tIHRoZSBmaWxlXG4gICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN1cGVydXNlcmZpbGUuc3VwZXJ1c2Vycy5wdXNoKGFyZ3MubWVtYmVyLmlkKVxuICAgICAgICAgICAgICAgICAgICBqc29uZmlsZS53cml0ZUZpbGUoZmlsZSwgc3VwZXJ1c2VyZmlsZSlcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS5jaGFubmVsLnNlbmQoYCR7YXJncy5tZW1iZXJ9IGlzIG5vdyBhIHN1cGVydXNlci5gKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN1cGVydXNlcmZpbGUpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSlcbiAgICB9XG59XG4iXX0=
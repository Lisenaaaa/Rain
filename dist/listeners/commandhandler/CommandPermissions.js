"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class missingPermissions extends discord_akairo_1.Listener {
    constructor(client) {
        super("missingPermissions", {
            emitter: "commandHandler",
            event: "missingPermissions",
            category: "commandHandler"
        });
        this.client = client;
    }
    exec(message, command, type) {
        // console.log(type)
        const PermsErrorEmbed = new discord_js_1.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Something went wrong!');
        if (type == "user") {
            let perm = command.userPermissions[0];
            PermsErrorEmbed.setDescription(`You cannot run this command, as you don't have \`${perm}\`.`);
        }
        else {
            let perm = command.clientPermissions[0];
            PermsErrorEmbed.setDescription(`I don't have \`${perm}\`, which I need to have to run this command.`);
        }
        // console.log(type)
        message.channel.send(PermsErrorEmbed);
    }
}
exports.default = missingPermissions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZFBlcm1pc3Npb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpc3RlbmVycy9jb21tYW5kaGFuZGxlci9Db21tYW5kUGVybWlzc2lvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBMEM7QUFDMUMsMkNBQTBDO0FBRTFDLE1BQXFCLGtCQUFtQixTQUFRLHlCQUFRO0lBRXBELFlBQW1CLE1BQWlCO1FBQ2hDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRTtZQUN4QixPQUFPLEVBQUUsZ0JBQWdCO1lBQ3pCLEtBQUssRUFBRSxvQkFBb0I7WUFDM0IsUUFBUSxFQUFFLGdCQUFnQjtTQUM3QixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSTtRQUN2QixvQkFBb0I7UUFFcEIsTUFBTSxlQUFlLEdBQUcsSUFBSSx5QkFBWSxFQUFFO2FBQ3pDLFFBQVEsQ0FBQyxTQUFTLENBQUM7YUFDbkIsUUFBUSxDQUFDLHVCQUF1QixDQUFDLENBQUE7UUFFbEMsSUFBSSxJQUFJLElBQUksTUFBTSxFQUFFO1lBQ2hCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDckMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxvREFBb0QsSUFBSSxLQUFLLENBQUMsQ0FBQTtTQUNoRzthQUFNO1lBQ0gsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3ZDLGVBQWUsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLElBQUksK0NBQStDLENBQUMsQ0FBQTtTQUN4RztRQUNELG9CQUFvQjtRQUNwQixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtJQUV6QyxDQUFDO0NBRUo7QUE5QkQscUNBOEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTGlzdGVuZXIgfSBmcm9tIFwiZGlzY29yZC1ha2Fpcm9cIjtcclxuaW1wb3J0IHsgTWVzc2FnZUVtYmVkIH0gZnJvbSBcImRpc2NvcmQuanNcIjtcclxuaW1wb3J0IHsgQm90Q2xpZW50IH0gZnJvbSBcIi4uLy4uL2V4dGVuc2lvbnMvQm90Q2xpZW50XCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIG1pc3NpbmdQZXJtaXNzaW9ucyBleHRlbmRzIExpc3RlbmVyIHtcclxuICAgIGNsaWVudDogQm90Q2xpZW50O1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNsaWVudDogQm90Q2xpZW50KSB7XHJcbiAgICAgICAgc3VwZXIoXCJtaXNzaW5nUGVybWlzc2lvbnNcIiwge1xyXG4gICAgICAgICAgICBlbWl0dGVyOiBcImNvbW1hbmRIYW5kbGVyXCIsXHJcbiAgICAgICAgICAgIGV2ZW50OiBcIm1pc3NpbmdQZXJtaXNzaW9uc1wiLFxyXG4gICAgICAgICAgICBjYXRlZ29yeTogXCJjb21tYW5kSGFuZGxlclwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZXhlYyhtZXNzYWdlLCBjb21tYW5kLCB0eXBlKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codHlwZSlcclxuXHJcbiAgICAgICAgY29uc3QgUGVybXNFcnJvckVtYmVkID0gbmV3IE1lc3NhZ2VFbWJlZCgpXHJcbiAgICAgICAgLnNldENvbG9yKCcjZmYwMDAwJylcclxuICAgICAgICAuc2V0VGl0bGUoJ1NvbWV0aGluZyB3ZW50IHdyb25nIScpXHJcblxyXG4gICAgICAgIGlmICh0eXBlID09IFwidXNlclwiKSB7XHJcbiAgICAgICAgICAgIGxldCBwZXJtID0gY29tbWFuZC51c2VyUGVybWlzc2lvbnNbMF1cclxuICAgICAgICAgICAgUGVybXNFcnJvckVtYmVkLnNldERlc2NyaXB0aW9uKGBZb3UgY2Fubm90IHJ1biB0aGlzIGNvbW1hbmQsIGFzIHlvdSBkb24ndCBoYXZlIFxcYCR7cGVybX1cXGAuYClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgcGVybSA9IGNvbW1hbmQuY2xpZW50UGVybWlzc2lvbnNbMF1cclxuICAgICAgICAgICAgUGVybXNFcnJvckVtYmVkLnNldERlc2NyaXB0aW9uKGBJIGRvbid0IGhhdmUgXFxgJHtwZXJtfVxcYCwgd2hpY2ggSSBuZWVkIHRvIGhhdmUgdG8gcnVuIHRoaXMgY29tbWFuZC5gKVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0eXBlKVxyXG4gICAgICAgIG1lc3NhZ2UuY2hhbm5lbC5zZW5kKFBlcm1zRXJyb3JFbWJlZClcclxuXHJcbiAgICB9XHJcblxyXG59Il19
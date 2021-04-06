"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class info extends discord_akairo_1.Command {
    constructor() {
        super("info", {
            aliases: ["info", "botinfo"]
        });
    }
    exec(message) {
        //console.log("[Command ran] info")
        message.channel.send(`Hello! uh what do i put here other than its coded in typescript`);
    }
}
exports.default = info;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9taXNjL2luZm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBeUM7QUFFekMsTUFBcUIsSUFBSyxTQUFRLHdCQUFPO0lBQ3hDO1FBQ0MsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNiLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUM7U0FDNUIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELElBQUksQ0FBQyxPQUFPO1FBQ1gsbUNBQW1DO1FBQ25DLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlFQUFpRSxDQUFDLENBQUE7SUFDeEYsQ0FBQztDQUNEO0FBWEQsdUJBV0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tYW5kIH0gZnJvbSBcImRpc2NvcmQtYWthaXJvXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBpbmZvIGV4dGVuZHMgQ29tbWFuZCB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcihcImluZm9cIiwge1xyXG5cdFx0XHRhbGlhc2VzOiBbXCJpbmZvXCIsIFwiYm90aW5mb1wiXSBcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZXhlYyhtZXNzYWdlKSB7XHJcblx0XHQvL2NvbnNvbGUubG9nKFwiW0NvbW1hbmQgcmFuXSBpbmZvXCIpXHJcblx0XHRtZXNzYWdlLmNoYW5uZWwuc2VuZChgSGVsbG8hIHVoIHdoYXQgZG8gaSBwdXQgaGVyZSBvdGhlciB0aGFuIGl0cyBjb2RlZCBpbiB0eXBlc2NyaXB0YClcclxuXHR9XHJcbn0iXX0=
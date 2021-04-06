"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class command extends discord_akairo_1.Command {
    constructor() {
        super("command", {
            aliases: ["command"],
        });
    }
    async exec(message) {
        await message.channel.send("this is a command");
        console.log("hi");
    }
}
exports.default = command;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy90ZXN0aW5nL2NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBeUM7QUFFekMsTUFBcUIsT0FBUSxTQUFRLHdCQUFPO0lBQzNDO1FBQ0MsS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUNoQixPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUM7U0FFcEIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTztRQUNqQixNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUE7UUFDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNsQixDQUFDO0NBQ0Q7QUFaRCwwQkFZQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1hbmQgfSBmcm9tIFwiZGlzY29yZC1ha2Fpcm9cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgY29tbWFuZCBleHRlbmRzIENvbW1hbmQge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcihcImNvbW1hbmRcIiwge1xuXHRcdFx0YWxpYXNlczogW1wiY29tbWFuZFwiXSxcblxuXHRcdH0pO1xuXHR9XG5cblx0YXN5bmMgZXhlYyhtZXNzYWdlKSB7XG5cdFx0YXdhaXQgbWVzc2FnZS5jaGFubmVsLnNlbmQoXCJ0aGlzIGlzIGEgY29tbWFuZFwiKVxuXHRcdGNvbnNvbGUubG9nKFwiaGlcIilcblx0fVxufSJdfQ==
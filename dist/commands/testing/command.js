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
    }
}
exports.default = command;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy90ZXN0aW5nL2NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBeUM7QUFFekMsTUFBcUIsT0FBUSxTQUFRLHdCQUFPO0lBQzNDO1FBQ0MsS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUNoQixPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUM7U0FFcEIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTztRQUNqQixNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUE7SUFDaEQsQ0FBQztDQUNEO0FBWEQsMEJBV0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tYW5kIH0gZnJvbSBcImRpc2NvcmQtYWthaXJvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGNvbW1hbmQgZXh0ZW5kcyBDb21tYW5kIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoXCJjb21tYW5kXCIsIHtcblx0XHRcdGFsaWFzZXM6IFtcImNvbW1hbmRcIl0sXG5cblx0XHR9KTtcblx0fVxuXG5cdGFzeW5jIGV4ZWMobWVzc2FnZSkge1xuXHRcdGF3YWl0IG1lc3NhZ2UuY2hhbm5lbC5zZW5kKFwidGhpcyBpcyBhIGNvbW1hbmRcIilcblx0fVxufSJdfQ==
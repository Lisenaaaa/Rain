"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class BlacklistInhibitor extends discord_akairo_1.Inhibitor {
    constructor() {
        super("blacklist", {
            reason: "blacklist"
        });
    }
    exec(message) {
        // He's a meanie!
        const blacklist = ["81440962496172032"];
        return blacklist.includes(message.author.id);
    }
}
module.exports = BlacklistInhibitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5oaWJpdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmhpYml0b3JzL2luaGliaXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBMkM7QUFFM0MsTUFBTSxrQkFBbUIsU0FBUSwwQkFBUztJQUN6QztRQUNDLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDbEIsTUFBTSxFQUFFLFdBQVc7U0FDbkIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELElBQUksQ0FBQyxPQUFPO1FBQ1gsaUJBQWlCO1FBQ2pCLE1BQU0sU0FBUyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN4QyxPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM5QyxDQUFDO0NBQ0Q7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLGtCQUFrQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5oaWJpdG9yIH0gZnJvbSBcImRpc2NvcmQtYWthaXJvXCI7XHJcblxyXG5jbGFzcyBCbGFja2xpc3RJbmhpYml0b3IgZXh0ZW5kcyBJbmhpYml0b3Ige1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoXCJibGFja2xpc3RcIiwge1xyXG5cdFx0XHRyZWFzb246IFwiYmxhY2tsaXN0XCJcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZXhlYyhtZXNzYWdlKSB7XHJcblx0XHQvLyBIZSdzIGEgbWVhbmllIVxyXG5cdFx0Y29uc3QgYmxhY2tsaXN0ID0gW1wiODE0NDA5NjI0OTYxNzIwMzJcIl07XHJcblx0XHRyZXR1cm4gYmxhY2tsaXN0LmluY2x1ZGVzKG1lc3NhZ2UuYXV0aG9yLmlkKTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmxhY2tsaXN0SW5oaWJpdG9yOyJdfQ==
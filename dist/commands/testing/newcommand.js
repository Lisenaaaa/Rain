"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class newcommand extends discord_akairo_1.Command {
    constructor() {
        super("newcommand", {
            aliases: ["newcommand"],
        });
    }
    async exec(message) {
        await message.channel.send("hello?");
    }
}
exports.default = newcommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3Y29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy90ZXN0aW5nL25ld2NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBeUM7QUFFekMsTUFBcUIsVUFBVyxTQUFRLHdCQUFPO0lBQzNDO1FBQ0ksS0FBSyxDQUFDLFlBQVksRUFBRTtZQUNoQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7U0FDMUIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTztRQUNkLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDeEMsQ0FBQztDQUNKO0FBVkQsNkJBVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tYW5kIH0gZnJvbSBcImRpc2NvcmQtYWthaXJvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIG5ld2NvbW1hbmQgZXh0ZW5kcyBDb21tYW5kIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJuZXdjb21tYW5kXCIsIHtcbiAgICAgICAgICAgIGFsaWFzZXM6IFtcIm5ld2NvbW1hbmRcIl0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGV4ZWMobWVzc2FnZSkge1xuICAgICAgICBhd2FpdCBtZXNzYWdlLmNoYW5uZWwuc2VuZChcImhlbGxvP1wiKVxuICAgIH1cbn1cbiJdfQ==
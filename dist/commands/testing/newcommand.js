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
        await message.channel.send("why do i have to keep editing this aaa");
    }
}
exports.default = newcommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3Y29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy90ZXN0aW5nL25ld2NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBeUM7QUFFekMsTUFBcUIsVUFBVyxTQUFRLHdCQUFPO0lBQzNDO1FBQ0ksS0FBSyxDQUFDLFlBQVksRUFBRTtZQUNoQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7U0FDMUIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTztRQUNkLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQTtJQUN4RSxDQUFDO0NBQ0o7QUFWRCw2QkFVQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1hbmQgfSBmcm9tIFwiZGlzY29yZC1ha2Fpcm9cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgbmV3Y29tbWFuZCBleHRlbmRzIENvbW1hbmQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIm5ld2NvbW1hbmRcIiwge1xuICAgICAgICAgICAgYWxpYXNlczogW1wibmV3Y29tbWFuZFwiXSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlYyhtZXNzYWdlKSB7XG4gICAgICAgIGF3YWl0IG1lc3NhZ2UuY2hhbm5lbC5zZW5kKFwid2h5IGRvIGkgaGF2ZSB0byBrZWVwIGVkaXRpbmcgdGhpcyBhYWFcIilcbiAgICB9XG59XG4iXX0=
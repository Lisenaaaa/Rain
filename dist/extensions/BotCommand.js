"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotCommand = void 0;
const discord_akairo_1 = require("discord-akairo");
class BotCommand extends discord_akairo_1.Command {
    constructor() {
        super(...arguments);
        this.client = super.client;
    }
}
exports.BotCommand = BotCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm90Q29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHRlbnNpb25zL0JvdENvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbURBQXlDO0FBR3pDLE1BQWEsVUFBVyxTQUFRLHdCQUFPO0lBQXZDOztRQUNRLFdBQU0sR0FBRyxLQUFLLENBQUMsTUFBbUIsQ0FBQTtJQUMxQyxDQUFDO0NBQUE7QUFGRCxnQ0FFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1hbmQgfSBmcm9tIFwiZGlzY29yZC1ha2Fpcm9cIjtcclxuaW1wb3J0IHsgQm90Q2xpZW50IH0gZnJvbSBcIi4vQm90Q2xpZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQm90Q29tbWFuZCBleHRlbmRzIENvbW1hbmQge1xyXG5cdHB1YmxpYyBjbGllbnQgPSBzdXBlci5jbGllbnQgYXMgQm90Q2xpZW50XHJcbn0iXX0=
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotInhibitor = void 0;
const discord_akairo_1 = require("discord-akairo");
class BotInhibitor extends discord_akairo_1.Inhibitor {
    constructor() {
        super(...arguments);
        this.client = super.client;
    }
}
exports.BotInhibitor = BotInhibitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm90SW5oaWJpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V4dGVuc2lvbnMvQm90SW5oaWJpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUEyQztBQUczQyxNQUFhLFlBQWEsU0FBUSwwQkFBUztJQUEzQzs7UUFDUSxXQUFNLEdBQUcsS0FBSyxDQUFDLE1BQW1CLENBQUE7SUFDMUMsQ0FBQztDQUFBO0FBRkQsb0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmhpYml0b3IgfSBmcm9tIFwiZGlzY29yZC1ha2Fpcm9cIjtcclxuaW1wb3J0IHsgQm90Q2xpZW50IH0gZnJvbSBcIi4vQm90Q2xpZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQm90SW5oaWJpdG9yIGV4dGVuZHMgSW5oaWJpdG9yIHtcclxuXHRwdWJsaWMgY2xpZW50ID0gc3VwZXIuY2xpZW50IGFzIEJvdENsaWVudFxyXG59Il19
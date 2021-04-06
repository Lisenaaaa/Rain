"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class invite extends discord_akairo_1.Command {
    constructor() {
        super("invite", {
            aliases: ["invite"],
        });
    }
    async exec(message) {
        if (message.author.id == 492488074442309642) {
            message.channel.send(process.env["invite"]);
        }
        else {
            message.channel.send(`yeah no`);
        }
    }
}
exports.default = invite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52aXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL293bmVyL2ludml0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1EQUF5QztBQUV6QyxNQUFxQixNQUFPLFNBQVEsd0JBQU87SUFDMUM7UUFDQyxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ2YsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO1NBQ25CLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU87UUFDakIsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxrQkFBa0IsRUFBRTtZQUNuQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7U0FDOUM7YUFDRztZQUNBLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQ2xDO0lBQ1IsQ0FBQztDQUNEO0FBZkQseUJBZUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tYW5kIH0gZnJvbSBcImRpc2NvcmQtYWthaXJvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGludml0ZSBleHRlbmRzIENvbW1hbmQge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcihcImludml0ZVwiLCB7XG5cdFx0XHRhbGlhc2VzOiBbXCJpbnZpdGVcIl0sXG5cdFx0fSk7XG5cdH1cblxuXHRhc3luYyBleGVjKG1lc3NhZ2UpIHtcblx0XHRpZiAobWVzc2FnZS5hdXRob3IuaWQgPT0gNDkyNDg4MDc0NDQyMzA5NjQyKSB7XG4gICAgICAgICAgICBtZXNzYWdlLmNoYW5uZWwuc2VuZChwcm9jZXNzLmVudltcImludml0ZVwiXSlcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgbWVzc2FnZS5jaGFubmVsLnNlbmQoYHllYWggbm9gKVxuICAgICAgICB9XG5cdH1cbn0iXX0=
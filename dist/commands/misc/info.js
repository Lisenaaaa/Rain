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
        return message.channel.send(`Hello! uh what do i put here other than its coded in typescript`);
    }
}
exports.default = info;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9taXNjL2luZm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBeUM7QUFFekMsTUFBcUIsSUFBSyxTQUFRLHdCQUFPO0lBQ3hDO1FBQ0MsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNiLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUM7U0FDNUIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELElBQUksQ0FBQyxPQUFPO1FBQ1gsbUNBQW1DO1FBQ25DLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUVBQWlFLENBQUMsQ0FBQTtJQUMvRixDQUFDO0NBQ0Q7QUFYRCx1QkFXQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1hbmQgfSBmcm9tIFwiZGlzY29yZC1ha2Fpcm9cIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGluZm8gZXh0ZW5kcyBDb21tYW5kIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKFwiaW5mb1wiLCB7XHJcblx0XHRcdGFsaWFzZXM6IFtcImluZm9cIiwgXCJib3RpbmZvXCJdIFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRleGVjKG1lc3NhZ2UpIHtcclxuXHRcdC8vY29uc29sZS5sb2coXCJbQ29tbWFuZCByYW5dIGluZm9cIilcclxuXHRcdHJldHVybiBtZXNzYWdlLmNoYW5uZWwuc2VuZChgSGVsbG8hIHVoIHdoYXQgZG8gaSBwdXQgaGVyZSBvdGhlciB0aGFuIGl0cyBjb2RlZCBpbiB0eXBlc2NyaXB0YClcclxuXHR9XHJcbn0iXX0=
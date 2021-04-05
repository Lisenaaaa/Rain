"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotClient = void 0;
const discord_akairo_1 = require("discord-akairo");
const path_1 = require("path");
class BotClient extends discord_akairo_1.AkairoClient {
    constructor() {
        super({
            ownerID: [
                "492488074442309642"
            ]
        }, {
            allowedMentions: {
                parse: ["users"] // Disables all mentions except for users
            }
        });
        this.commandHandler = new discord_akairo_1.CommandHandler(this, {
            prefix: ["-", "."],
            commandUtil: true,
            handleEdits: true,
            directory: path_1.join(__dirname, "..", "commands"),
            allowMention: true,
            automateCategories: true
        });
        this.listenerHandler = new discord_akairo_1.ListenerHandler(this, {
            directory: path_1.join(__dirname, "..", "listeners"),
            automateCategories: true
        });
        this.inhibitorHandler = new discord_akairo_1.InhibitorHandler(this, {
            directory: path_1.join(__dirname, "..", "inhibitors")
        });
    }
    async _init() {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
            process
        });
        // loads all the stuff
        const loaders = {
            commands: this.commandHandler,
            listeners: this.listenerHandler,
            inhibitors: this.inhibitorHandler,
        };
        for (const loader of Object.keys(loaders)) {
            try {
                loaders[loader].loadAll();
                console.log("Successfully loaded " + loader + ".");
            }
            catch (e) {
                console.error("Unable to load " + loader + " with error " + e);
            }
        }
    }
    async start() {
        await this._init();
        //hidestream
        return this.login(process.env["token"]);
    }
}
exports.BotClient = BotClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm90Q2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V4dGVuc2lvbnMvQm90Q2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUFpRztBQUNqRywrQkFBNEI7QUFFNUIsTUFBYSxTQUFVLFNBQVEsNkJBQVk7SUFnQjFDO1FBQ0MsS0FBSyxDQUFDO1lBQ0wsT0FBTyxFQUFFO2dCQUNSLG9CQUFvQjthQUNwQjtTQUNELEVBQ0Q7WUFDQyxlQUFlLEVBQUU7Z0JBQ2hCLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLHlDQUF5QzthQUMxRDtTQUNELENBQUMsQ0FBQztRQXpCRyxtQkFBYyxHQUFtQixJQUFJLCtCQUFjLENBQUMsSUFBSSxFQUFFO1lBQ2hFLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDbEIsV0FBVyxFQUFFLElBQUk7WUFDakIsV0FBVyxFQUFFLElBQUk7WUFDakIsU0FBUyxFQUFFLFdBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQztZQUM1QyxZQUFZLEVBQUUsSUFBSTtZQUNsQixrQkFBa0IsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQTtRQUNLLG9CQUFlLEdBQW9CLElBQUksZ0NBQWUsQ0FBQyxJQUFJLEVBQUU7WUFDbkUsU0FBUyxFQUFFLFdBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQztZQUM3QyxrQkFBa0IsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQTtRQUNLLHFCQUFnQixHQUFxQixJQUFJLGlDQUFnQixDQUFDLElBQUksRUFBRTtZQUN0RSxTQUFTLEVBQUUsV0FBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDO1NBQzlDLENBQUMsQ0FBQTtJQVlGLENBQUM7SUFDTyxLQUFLLENBQUMsS0FBSztRQUNsQixJQUFJLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDO1lBQ2hDLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztZQUNuQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWU7WUFDckMsT0FBTztTQUNQLENBQUMsQ0FBQztRQUNILHNCQUFzQjtRQUN0QixNQUFNLE9BQU8sR0FBRztZQUNmLFFBQVEsRUFBRSxJQUFJLENBQUMsY0FBYztZQUM3QixTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWU7WUFDL0IsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7U0FDakMsQ0FBQztRQUNGLEtBQUssTUFBTSxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMxQyxJQUFJO2dCQUNILE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7YUFDbkQ7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLGlCQUFpQixHQUFHLE1BQU0sR0FBRyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDL0Q7U0FDRDtJQUNGLENBQUM7SUFFTSxLQUFLLENBQUMsS0FBSztRQUNqQixNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNuQixZQUFZO1FBQ1osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDO0NBQ0Q7QUF6REQsOEJBeURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWthaXJvQ2xpZW50LCBDb21tYW5kSGFuZGxlciwgSW5oaWJpdG9ySGFuZGxlciwgTGlzdGVuZXJIYW5kbGVyIH0gZnJvbSBcImRpc2NvcmQtYWthaXJvXCI7XHJcbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwicGF0aFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJvdENsaWVudCBleHRlbmRzIEFrYWlyb0NsaWVudCB7XHJcblx0cHVibGljIGNvbW1hbmRIYW5kbGVyOiBDb21tYW5kSGFuZGxlciA9IG5ldyBDb21tYW5kSGFuZGxlcih0aGlzLCB7XHJcblx0XHRwcmVmaXg6IFtcIi1cIiwgXCIuXCJdLCBcclxuXHRcdGNvbW1hbmRVdGlsOiB0cnVlLFxyXG5cdFx0aGFuZGxlRWRpdHM6IHRydWUsXHJcblx0XHRkaXJlY3Rvcnk6IGpvaW4oX19kaXJuYW1lLCBcIi4uXCIsIFwiY29tbWFuZHNcIiksXHJcblx0XHRhbGxvd01lbnRpb246IHRydWUsXHJcblx0XHRhdXRvbWF0ZUNhdGVnb3JpZXM6IHRydWVcclxuXHR9KVxyXG5cdHB1YmxpYyBsaXN0ZW5lckhhbmRsZXI6IExpc3RlbmVySGFuZGxlciA9IG5ldyBMaXN0ZW5lckhhbmRsZXIodGhpcywge1xyXG5cdFx0ZGlyZWN0b3J5OiBqb2luKF9fZGlybmFtZSwgXCIuLlwiLCBcImxpc3RlbmVyc1wiKSxcclxuXHRcdGF1dG9tYXRlQ2F0ZWdvcmllczogdHJ1ZVxyXG5cdH0pXHJcblx0cHVibGljIGluaGliaXRvckhhbmRsZXI6IEluaGliaXRvckhhbmRsZXIgPSBuZXcgSW5oaWJpdG9ySGFuZGxlcih0aGlzLCB7XHJcblx0XHRkaXJlY3Rvcnk6IGpvaW4oX19kaXJuYW1lLCBcIi4uXCIsIFwiaW5oaWJpdG9yc1wiKVxyXG5cdH0pXHJcblx0cHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0c3VwZXIoe1xyXG5cdFx0XHRvd25lcklEOiBbXHJcblx0XHRcdFx0XCI0OTI0ODgwNzQ0NDIzMDk2NDJcIlxyXG5cdFx0XHRdXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRhbGxvd2VkTWVudGlvbnM6IHtcclxuXHRcdFx0XHRwYXJzZTogW1widXNlcnNcIl0gLy8gRGlzYWJsZXMgYWxsIG1lbnRpb25zIGV4Y2VwdCBmb3IgdXNlcnNcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdHByaXZhdGUgYXN5bmMgX2luaXQoKTogUHJvbWlzZTx2b2lkPiB7XHJcblx0XHR0aGlzLmNvbW1hbmRIYW5kbGVyLnVzZUxpc3RlbmVySGFuZGxlcih0aGlzLmxpc3RlbmVySGFuZGxlcik7XHJcblx0XHR0aGlzLmNvbW1hbmRIYW5kbGVyLnVzZUluaGliaXRvckhhbmRsZXIodGhpcy5pbmhpYml0b3JIYW5kbGVyKTtcclxuXHRcdHRoaXMubGlzdGVuZXJIYW5kbGVyLnNldEVtaXR0ZXJzKHtcclxuXHRcdFx0Y29tbWFuZEhhbmRsZXI6IHRoaXMuY29tbWFuZEhhbmRsZXIsXHJcblx0XHRcdGxpc3RlbmVySGFuZGxlcjogdGhpcy5saXN0ZW5lckhhbmRsZXIsXHJcblx0XHRcdHByb2Nlc3NcclxuXHRcdH0pO1xyXG5cdFx0Ly8gbG9hZHMgYWxsIHRoZSBzdHVmZlxyXG5cdFx0Y29uc3QgbG9hZGVycyA9IHtcclxuXHRcdFx0Y29tbWFuZHM6IHRoaXMuY29tbWFuZEhhbmRsZXIsXHJcblx0XHRcdGxpc3RlbmVyczogdGhpcy5saXN0ZW5lckhhbmRsZXIsXHJcblx0XHRcdGluaGliaXRvcnM6IHRoaXMuaW5oaWJpdG9ySGFuZGxlcixcclxuXHRcdH07XHJcblx0XHRmb3IgKGNvbnN0IGxvYWRlciBvZiBPYmplY3Qua2V5cyhsb2FkZXJzKSkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGxvYWRlcnNbbG9hZGVyXS5sb2FkQWxsKCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJTdWNjZXNzZnVsbHkgbG9hZGVkIFwiICsgbG9hZGVyICsgXCIuXCIpO1xyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcIlVuYWJsZSB0byBsb2FkIFwiICsgbG9hZGVyICsgXCIgd2l0aCBlcnJvciBcIiArIGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYXN5bmMgc3RhcnQoKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHRcdGF3YWl0IHRoaXMuX2luaXQoKTtcclxuXHRcdC8vaGlkZXN0cmVhbVxyXG5cdFx0cmV0dXJuIHRoaXMubG9naW4ocHJvY2Vzcy5lbnZbXCJ0b2tlblwiXSk7XHJcblx0fVxyXG59Il19
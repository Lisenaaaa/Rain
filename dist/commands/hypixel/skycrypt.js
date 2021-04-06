"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class skycrypt extends discord_akairo_1.Command {
    constructor() {
        super('skycrypt', {
            aliases: ['skycrypt'],
            args: [
                {
                    id: 'ign',
                    type: 'string'
                },
            ],
            channel: 'guild'
        });
    }
    async exec(message, args) {
        message.channel.send(`https://sky.shiiyu.moe/stats/${args.ign}`);
    }
}
exports.default = skycrypt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2t5Y3J5cHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvaHlwaXhlbC9za3ljcnlwdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1EQUF5QztBQUV6QyxNQUFxQixRQUFTLFNBQVEsd0JBQU87SUFDekM7UUFDSSxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ2QsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ3JCLElBQUksRUFBRTtnQkFDRjtvQkFDSSxFQUFFLEVBQUUsS0FBSztvQkFDVCxJQUFJLEVBQUUsUUFBUTtpQkFDakI7YUFDSjtZQUNELE9BQU8sRUFBRSxPQUFPO1NBQ25CLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJO1FBRXBCLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUVyRSxDQUFDO0NBQ0o7QUFuQkQsMkJBbUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJ2Rpc2NvcmQtYWthaXJvJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHNreWNyeXB0IGV4dGVuZHMgQ29tbWFuZCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcignc2t5Y3J5cHQnLCB7XHJcbiAgICAgICAgICAgIGFsaWFzZXM6IFsnc2t5Y3J5cHQnXSxcclxuICAgICAgICAgICAgYXJnczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiAnaWduJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgY2hhbm5lbDogJ2d1aWxkJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGV4ZWMobWVzc2FnZSwgYXJncykge1xyXG5cclxuICAgICAgICBtZXNzYWdlLmNoYW5uZWwuc2VuZChgaHR0cHM6Ly9za3kuc2hpaXl1Lm1vZS9zdGF0cy8ke2FyZ3MuaWdufWApO1xyXG5cclxuICAgIH1cclxufVxyXG4iXX0=
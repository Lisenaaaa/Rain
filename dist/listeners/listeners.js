"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class ReadyListener extends discord_akairo_1.Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }
    exec() {
        console.log('I\'m ready!');
    }
}
module.exports = ReadyListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdGVuZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpc3RlbmVycy9saXN0ZW5lcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBMEM7QUFFMUMsTUFBTSxhQUFjLFNBQVEseUJBQVE7SUFDaEM7UUFDSSxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQ1gsT0FBTyxFQUFFLFFBQVE7WUFDakIsS0FBSyxFQUFFLE9BQU87U0FDakIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FDSjtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTGlzdGVuZXIgfSBmcm9tICdkaXNjb3JkLWFrYWlybyc7XHJcblxyXG5jbGFzcyBSZWFkeUxpc3RlbmVyIGV4dGVuZHMgTGlzdGVuZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoJ3JlYWR5Jywge1xyXG4gICAgICAgICAgICBlbWl0dGVyOiAnY2xpZW50JyxcclxuICAgICAgICAgICAgZXZlbnQ6ICdyZWFkeSdcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBleGVjKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdJXFwnbSByZWFkeSEnKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFkeUxpc3RlbmVyOyJdfQ==
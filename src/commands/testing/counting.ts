/*import { Command } from 'discord-akairo';

export default class counting extends Command {
    constructor() {
        super('countto', {
            aliases: ['countto'],
            args: [
                {
                    id: 'number',
                    type: 'integer'
                },
            ],
            channel: 'guild'
        });
    }

    async exec(message, args) {

        let n = 0
        
        for(var i:number=0;i<args.number;i++)
        {
        if(n != args.number) {
            n = n+1
            message.channel.send(n)
        }
    }
        
    

    }
}
*/
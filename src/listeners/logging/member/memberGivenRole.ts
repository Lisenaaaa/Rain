import { BotListener } from '../../../extensions/BotListener';

class memberUpdate extends BotListener {
    constructor() {
        super('memberUpdate', {
            emitter: 'client',
            event: 'guildMemberUpdate'
        });
    }

    exec(oldMember, newMember) {
        console.log(oldMember)
        console.log(`\n\nNEW MEMBER\n\n`)
        console.log(newMember)
    }
}

module.exports = memberUpdate;
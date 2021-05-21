import { BotListener } from '../../../extensions/BotListener';
import utils from '../../../functions/utils';

class memberUpdate extends BotListener {
    constructor() {
        super('memberUpdate', {
            emitter: 'client',
            event: 'guildMemberUpdate'
        });
    }

    exec(oldMember, newMember) {
        (utils.getObjectDifferences(oldMember, newMember)).then(e => {
            if (e["_roles"]) {
                const roles = e["_roles"]
                
                if (roles.object1.length > roles.object2.length) {
                    const filtered = roles.object1.filter(e => !roles.object2.includes(e))
                    console.log(`role ${newMember.guild.roles.cache.get(filtered[0]).name} was removed from ${newMember.user.tag} on ${newMember.guild.name}`)
                }
                else if (roles.object1.length < roles.object2.length) {
                    const filtered = roles.object2.filter(e => !roles.object1.includes(e))
                    console.log(`role ${newMember.guild.roles.cache.get(filtered[0]).name} was added to ${newMember.user.tag} on ${newMember.guild.name}`)
                }
            }
        })
    }
}

module.exports = memberUpdate;
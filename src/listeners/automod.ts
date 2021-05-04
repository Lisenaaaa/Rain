// import { Listener } from 'discord-akairo';
// import moderation from '../functions/moderation';
// import utils from '../functions/utils';

// const jsonfile = require('jsonfile')
// const file = 'config/global/bannedwords.json'

// class automodListener extends Listener {
//     constructor() {
//         super('automod', {
//             emitter: 'client',
//             event: 'message'
//         });
//     }

//     exec(message) {
//         let hasTriggered = false

//         jsonfile.readFile(file)
//             .then(badwords => {
//                 badwords.bannedwords.forEach(word => {
//                     if (message.content.includes(word) && hasTriggered != true) {

//                         message.channel.send(`No!`)
//                         hasTriggered = true
//                     }
//                 });
//             })
//             .catch(error => utils.errorhandling(error, message))
//     }
// }

// module.exports = automodListener;
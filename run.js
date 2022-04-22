const string = `[INFO] 2022-04-22 12:26:35 PM: ApplicationCommandRegistry[pronouns] Successfully created chat input command "pronouns" with id "967144409026166824". You should add the id to the "idHints" property of the register method you used!
[INFO] 2022-04-22 12:26:36 PM: ApplicationCommandRegistry[car] Successfully created chat input command "car" with id "967144410015997962". You should add the id to the "idHints" property of the register method you used!
[INFO] 2022-04-22 12:26:36 PM: ApplicationCommandRegistry[owner-channel] Successfully created chat input command "owner-channel" with id "967144410913595492". You should add the id to the "idHints" property of the register method you used!
[INFO] 2022-04-22 12:26:36 PM: ApplicationCommandRegistry[config] Successfully created chat input command "config" with id "967144411697917982". You should add the id to the "idHints" property of the register method you used!
[INFO] 2022-04-22 12:26:36 PM: ApplicationCommandRegistry[warn] Successfully created chat input command "warn" with id "967144412612292668". You should add the id to the "idHints" property of the register method you used!
[INFO] 2022-04-22 12:26:56 PM: ApplicationCommandRegistry[mute] Successfully created chat input command "mute" with id "967144496016019456". You should add the id to the "idHints" property of the register method you used!
[INFO] 2022-04-22 12:26:56 PM: ApplicationCommandRegistry[modlogs] Successfully created chat input command "modlogs" with id "967144496980705330". You should add the id to the "idHints" property of the register method you used!
[INFO] 2022-04-22 12:26:57 PM: ApplicationCommandRegistry[unban] Successfully created chat input command "unban" with id "967144497752465448". You should add the id to the "idHints" property of the register method you used!
[INFO] 2022-04-22 12:26:57 PM: ApplicationCommandRegistry[unmute] Successfully created chat input command "unmute" with id "967144498641657916". You should add the id to the "idHints" property of the register method you used!
[INFO] 2022-04-22 12:26:57 PM: ApplicationCommandRegistry[ban] Successfully created chat input command "ban" with id "967144499434381403". You should add the id to the "idHints" property of the register method you used!
[INFO] 2022-04-22 12:27:17 PM: ApplicationCommandRegistry[set-owner-role] Successfully created chat input command "set-owner-role" with id "967144582909427722". You should add the id to the "idHints" property of the register method you used!
[INFO] 2022-04-22 12:27:17 PM: ApplicationCommandRegistry[user] Successfully created chat input command "user" with id "967144583681179668". You should add the id to the "idHints" property of the register method you used!
[INFO] 2022-04-22 12:27:17 PM: ApplicationCommandRegistry[help] Successfully created chat input command "help" with id "967144584469696582". You should add the id to the "idHints" property of the register method you used!
[INFO] 2022-04-22 12:27:17 PM: ApplicationCommandRegistry[avatar] Successfully created chat input command "avatar" with id "967144585509896212". You should add the id to the "idHints" property of the register method you used!
[INFO] 2022-04-22 12:27:18 PM: ApplicationCommandRegistry[guild] Successfully created chat input command "guild" with id "967144586453602415". You should add the id to the "idHints" property of the register method you used!
[INFO] 2022-04-22 12:27:38 PM: ApplicationCommandRegistry[ping] Successfully created chat input command "ping" with id "967144669874098216". You should add the id to the "idHints" property of the register method you used!`
const format = (string) => {
    return `${string.split('"')[1]}: ${string.split('"')[3]}`
}

const split = string.split('\n')

for (const s of split) {
    console.log(format(s))
}
import { container } from '@sapphire/pieces'
import { User } from 'discord.js'
import got from 'got/dist/source'

export default class Users {
    isOwner(user: User) {
        return container.settings.owners.includes(user.id)
    }

    async getPronouns(user: User, context: 'pronoun' | 'pronoundb' | 'subject' | 'object' | 'possessiveDeterminer' | 'possessivePronoun' | 'reflexive' = 'pronoun'): Promise<string | undefined> {
        if (process.argv.includes('--noPronounDB')) {
            return undefined
        }

        try {
            const pronoundb = await JSON.parse((await got.get(`https://pronounapi.xyz/api/v1/lookup?id=${user.id}&platform=discord`)).body)
            return pronoundb.preferredPronoun[context]
        } catch (err) {
            //if they don't have pronouns set, or if pronoundb is down
            if (err == 'Error: Request failed with status code 404') {
                return undefined
            }
        }
    }
}

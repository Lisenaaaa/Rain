import { SapphireClient } from "@sapphire/framework";

export class RainClient extends SapphireClient {
    public async error(error: Error) {
        console.log('HI THERE WAS AN ERROR')
    }
    public testthingy = 'hello! this is katy testing things!'
}
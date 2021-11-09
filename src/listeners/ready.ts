import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions, SapphireClient } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
  once: true,
  event: 'ready'
})
export class ReadyListener extends Listener {
  public run(client: SapphireClient) {
    console.log(`logged in as ${client.user?.tag}`)
  }
}
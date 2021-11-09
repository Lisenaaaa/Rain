import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
  once: true,
  event: 'ready'
})
export class ReadyListener extends Listener {
  public run(client: Client) {
    console.log(`logged in as ${client.user.tag}`)
  }
}
### Configuration Values

Config Values:

 token: 
 > Discord Bot Token obtained from [here](https://discord.com/developers/applications)

Config constructors:

> RainClient.preStart()
> RainClient().start

Example config:

```
import 'module-alias/register'

import RainClient from '@extensions/RainClient'
import config from '@src/config/config'

RainClient.preStart()

const client = new RainClient()

const token = config.misc.tokenToUse as keyof typeof config.tokens

client.start(config.tokens[token]).catch(console.error)

export default client
```

(c) 2021 Raine

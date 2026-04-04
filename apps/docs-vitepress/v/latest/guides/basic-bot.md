# Basic Bot

A minimal bot that responds to !ping with Pong. See examples/first-steps-bot.js for !hello, !avatar, !embed, !perms.

::: tip
You can also use client.events for chainable, typed handlers with better autocomplete.
:::

::: code-group
```javascript [Default]
import { Client, Events } from '@erinjs/core';

const client = new Client({ intents: 0 });

client.on(Events.Ready, () => console.log('Ready!'));
client.on(Events.MessageCreate, async (message) => {
  if (message.content === '!ping') {
    await message.reply('Pong!');
  }
});

await client.login(process.env.ERIN_BOT_TOKEN);
```
```javascript [client.events]
import { Client, Events } from '@erinjs/core';

const client = new Client({ intents: 0 });

client
  .events.Ready(() => console.log('Ready!'))
  .events.MessageCreate(async (message) => {
    if (message.content === '!ping') await message.reply('Pong!');
  });

await client.login(process.env.ERIN_BOT_TOKEN);
```
:::

## Common mistakes

Always await message.reply() to avoid unhandled promise rejections. Use intents: 0 (erin.js does not support intents yet). Set ERIN_SUPPRESS_DEPRECATION=1 to silence deprecation warnings.

```javascript
// ❌ BAD — unhandled rejection if reply fails
message.reply('Pong!');

// ✅ GOOD
await message.reply('Pong!');
```

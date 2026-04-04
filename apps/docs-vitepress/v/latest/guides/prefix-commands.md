# Prefix Commands

Handle !commands by listening to MessageCreate and parsing the content.

## Basic Structure

Check for a prefix, split args, and dispatch to command handlers.

```javascript
import { Client, Events } from '@erinjs/core';

const PREFIX = '!';
const client = new Client({ intents: 0 });

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.content) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const command = args.shift()?.toLowerCase();

  if (command === 'ping') {
    await message.reply('Pong!');
  }
  if (command === 'hello') {
    const name = args[0] ?? 'there';
    await message.reply(`Hello, ${name}!`);
  }
});

await client.login(process.env.ERIN_BOT_TOKEN);
```

## Guild-Only Commands

```javascript
if (!message.guildId) {
  await message.reply('This command only works in a server.');
  return;
}
```

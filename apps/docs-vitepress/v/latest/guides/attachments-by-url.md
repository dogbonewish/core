# File Attachments by URL

Attach files by passing a URL instead of buffer data. The SDK fetches the URL and uploads it as a normal attachment.

## Using a URL

Pass { name, url } in the files array. The SDK fetches the URL (30s timeout), validates it with URL.canParse(), and uploads the result. Works with channel.send(), message.reply(), message.send(), webhook.send(), and client.channels.send().

```javascript
import { Client, Events } from '@erinjs/core';

const client = new Client({ intents: 0 });

client.on(Events.MessageCreate, async (message) => {
  if (message.content === '!attachurl') {
    await message.reply({
      content: 'Image from URL:',
      files: [
        {
          name: 'image.png',
          url: 'https://example.com/image.png',
        },
      ],
    });
  }
});

await client.login(process.env.ERIN_BOT_TOKEN);
```

## Mixing buffers and URLs

You can combine file data and URLs in the same message. Order is preserved; attachments metadata id matches the file index.

```javascript
await message.reply({
  content: 'Two files:',
  files: [
    { name: 'local.txt', data: Buffer.from('Hello') },
    { name: 'remote.png', url: 'https://example.com/logo.png' },
  ],
});
```

## Optional filename override

Use filename to control the displayed attachment name independently from the local name used during upload.

```javascript
files: [
  {
    name: 'fetched-image.png',
    url: 'https://example.com/image.jpg',
    filename: 'custom-display.png',
  },
]
```

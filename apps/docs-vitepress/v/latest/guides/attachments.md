# File Attachments

Upload files with messages and set attachment metadata (title, description, flags for spoiler, animated, explicit).

## Basic File Upload

Pass files in your send options. Each file needs a name and data (Buffer, Blob, Uint8Array). Use with message.reply(), message.send(), or channel.send().

```javascript
import { Client, Events } from '@erinjs/core';
import { readFileSync } from 'fs';

const client = new Client({ intents: 0 });

client.on(Events.MessageCreate, async (message) => {
  if (message.content === '!file') {
    const data = Buffer.from('Hello from erin.js!', 'utf-8');
    await message.reply({
      content: 'Here is a file:',
      files: [{ name: 'hello.txt', data }],
    });
  }
});
```

## Attachment Metadata

When using files, you can pass attachments to set metadata per file: filename, title, description, and flags. The id in each attachment matches the file index (0, 1, 2...).

```javascript
import { MessageAttachmentFlags } from '@erinjs/core';

await message.reply({
  content: 'Spoiler image:',
  files: [{ name: 'secret.png', data: imageBuffer }],
  attachments: [
    {
      id: 0,
      filename: 'secret.png',
      title: 'Hidden image',
      flags: MessageAttachmentFlags.IS_SPOILER,
    },
  ],
});
```

## Attachment Flags

MessageAttachmentFlags: IS_SPOILER (8) blurs until clicked, CONTAINS_EXPLICIT_MEDIA (16) for explicit content, IS_ANIMATED (32) for GIFs and animated WebP. Combine with bitwise OR.

```javascript
import { MessageAttachmentFlags } from '@erinjs/core';

// Spoiler (blurred until clicked)
flags: MessageAttachmentFlags.IS_SPOILER

// Animated image (GIF, animated WebP)
flags: MessageAttachmentFlags.IS_ANIMATED

// Combine flags
flags: MessageAttachmentFlags.IS_SPOILER | MessageAttachmentFlags.IS_ANIMATED
```

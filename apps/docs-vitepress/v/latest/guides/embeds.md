# Embeds

Complete reference for EmbedBuilder: title, description, author, footer, fields, color, media, and more.

## Overview

Use EmbedBuilder to create rich embeds. EmbedBuilder instances are auto-converted—no need to call .toJSON() when passing to reply(), send(), or edit(). An embed must have at least one of: title, description, fields, or image/thumbnail. A description-only embed (no title) is valid.

## Basic embed

Minimal embed with title, description, color, fields, footer, and timestamp.

```javascript
import { Client, Events, EmbedBuilder } from '@erinjs/core';

const client = new Client({ intents: 0 });

client.on(Events.MessageCreate, async (message) => {
  if (message.content === '!embed') {
    const embed = new EmbedBuilder()
      .setTitle('Hello!')
      .setDescription('This is a erin.js embed.')
      .setColor(0x5865f2)
      .addFields(
        { name: 'Field 1', value: 'Value 1', inline: true },
        { name: 'Field 2', value: 'Value 2', inline: true }
      )
      .setFooter({ text: 'Powered by erin.js' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
});

await client.login(process.env.ERIN_BOT_TOKEN);
```

## Title, Description, and URL

setTitle() and setDescription() accept strings (max 256 and 4096 chars). setURL() makes the title a clickable link.

```javascript
const embed = new EmbedBuilder()
  .setTitle('Clickable Title')
  .setDescription('Main body text here.')
  .setURL('https://example.com');
```

## Color

setColor() accepts: number (0x5865f2), hex string ("#5865f2"), or [r, g, b] array.

```javascript
embed.setColor(0x5865f2);
embed.setColor('#57f287');
embed.setColor([88, 101, 242]);
```

## Author

setAuthor() adds a header line with name. Optional: iconURL, url.

```javascript
embed.setAuthor({
  name: 'erin.js',
  iconURL: 'https://example.com/icon.png',
  url: 'https://erinjs.dev',
});
```

## Footer

setFooter() adds text at the bottom. Optional: iconURL.

```javascript
embed.setFooter({
  text: 'Powered by erin.js',
  iconURL: 'https://example.com/footer-icon.png',
});
```

## Timestamp

setTimestamp() shows a date. Omit or pass null for current time. Pass Date or number (ms) for a specific time.

```javascript
embed.setTimestamp();                    // current time
embed.setTimestamp(new Date('2026-01-01'));
embed.setTimestamp(Date.now() - 3600000);  // 1 hour ago
```

## Fields

addFields() adds name/value pairs. Max 25 fields. Use inline: true for side-by-side layout. spliceFields() to insert/remove.

```javascript
embed.addFields(
  { name: 'Field 1', value: 'Value 1', inline: true },
  { name: 'Field 2', value: 'Value 2', inline: true },
  { name: 'Long field', value: 'Not inline, full width' }
);

// Insert/replace fields
embed.spliceFields(1, 1, { name: 'Replaced', value: 'New value' });
```

## Image and Thumbnail

setImage() adds a large image. setThumbnail() adds a small image (e.g. top-right). Pass a URL string or EmbedMediaOptions (url, width, height, content_type, etc).

```javascript
embed.setImage('https://example.com/image.png');
embed.setThumbnail('https://example.com/thumb.png');

// With metadata
embed.setImage({
  url: 'https://example.com/image.png',
  width: 400,
  height: 200,
  content_type: 'image/png',
});
```

## Video and Audio

setVideo() and setAudio() add video/audio to embeds (erin.js supports these). Pass URL or EmbedMediaOptions. Include a title when using video. See Embed Media guide for full examples.

```javascript
embed.setVideo('https://example.com/video.mp4');
embed.setAudio({
  url: 'https://example.com/audio.mp3',
  duration: 120,
  content_type: 'audio/mpeg',
});
```

## Multiple embeds

Messages can include up to 10 embeds. Pass an array to embeds.

```javascript
await message.reply({
  embeds: [
    new EmbedBuilder().setTitle('First').setColor(0x5865f2),
    new EmbedBuilder().setTitle('Second').setColor(0x57f287),
  ],
});
```

## Load from existing embed

EmbedBuilder.from() creates a builder from an API embed (e.g. from a received message). Edit and toJSON() to send.

```javascript
const existing = message.embeds[0];
if (existing) {
  const edited = EmbedBuilder.from(existing)
    .setTitle('Updated title')
    .setColor(0x57f287);
  await message.edit({ embeds: [edited] });
}
```

## Limits

Title ≤256, description ≤4096, field name ≤256, field value ≤1024, footer ≤2048, author name ≤256. Max 25 fields. Combined title+description+fields+footer ≤6000 chars.

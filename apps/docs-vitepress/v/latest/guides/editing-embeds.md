# Editing Embeds

Edit existing message embeds with message.edit().

## Overview

The erin.js API supports editing existing messages via PATCH. You can update the message content, embeds, or both. Only the message author (or admins with proper permissions) can edit messages.

## Edit Content

Update the text content of a message you sent.

```javascript
const reply = await message.reply('Initial message');
await reply.edit({ content: 'Updated message!' });
```

## Edit Embeds

Replace or update embeds on an existing message. Pass an array of EmbedBuilder instances or APIEmbed objects.

```javascript
import { Client, Events, EmbedBuilder } from '@erinjs/core';

const client = new Client({ intents: 0 });

client.on(Events.MessageCreate, async (message) => {
  if (message.content === '!editembed') {
    const embed = new EmbedBuilder()
      .setTitle('Loading...')
      .setColor(0x5865f2)
      .setTimestamp();

    const reply = await message.reply({ embeds: [embed] });

    // Simulate loading, then update the embed
    await new Promise((r) => setTimeout(r, 2000));

    const updatedEmbed = new EmbedBuilder()
      .setTitle('Done!')
      .setDescription('This embed was edited after 2 seconds.')
      .setColor(0x57f287)
      .setTimestamp();

    await reply.edit({ embeds: [updatedEmbed] });
  }
});

await client.login(process.env.ERIN_BOT_TOKEN);
```

## Edit Content and Embeds Together

You can update both content and embeds in a single edit call.

```javascript
await message.edit({
  content: 'Updated text',
  embeds: [new EmbedBuilder().setTitle('Updated embed').setColor(0x5865f2)],
});
```

## API Reference

The edit endpoint is PATCH /channels/{channel_id}/messages/{message_id}. See openapi.json for the full request body schema. The SDK Message.edit() accepts { content?: string; embeds?: (APIEmbed | EmbedBuilder)[] }.

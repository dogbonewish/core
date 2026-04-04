# Webhooks

A complete guide to Discord webhooks—sending messages without a gateway, creating, editing, and managing webhooks.

## What are Webhooks?

Webhooks let you send messages to a channel using a URL (ID + token). You can use them in scripts, CI pipelines, or anywhere you need to post without a full bot connection. No gateway, no events—just REST.

## Webhooks Without a Bot

A Client with intents: 0 is enough. No need to connect to the gateway or handle events. Ideal for scripts or one-off sends.

```javascript
import { Client, Webhook } from '@erinjs/core';

const client = new Client({ intents: 0 });
const webhook = Webhook.fromToken(client, webhookId, webhookToken);
await webhook.send('Message from a script!');
```

## Creating a Webhook

Create a webhook on a text channel. Requires Manage Webhooks permission. The token is returned only when creating—store it securely. It will never be returned when listing or fetching.

```javascript
import { Client } from '@erinjs/core';

const client = new Client({ intents: 0 });
await client.login(process.env.ERIN_BOT_TOKEN);

const channel = client.channels.get(channelId);
if (!channel?.createWebhook) throw new Error('Channel does not support webhooks');

const webhook = await channel.createWebhook({ name: 'My Webhook' });
console.log(webhook.id, webhook.token); // Store token—it won't be returned when listing
```

## Sending Messages

Send text, embeds, or both. You can override the username and avatar for each message.

```javascript
import { Client, Webhook, EmbedBuilder } from '@erinjs/core';

const client = new Client({ intents: 0 });
const webhook = Webhook.fromToken(client, webhookId, webhookToken);

await webhook.send({
  content: 'Hello from webhook!',
  embeds: [
    new EmbedBuilder()
      .setTitle('Webhook Message')
      .setColor(0x5865f2)
      .setTimestamp(),
  ],
  username: 'Custom Name',
  avatar_url: 'https://example.com/avatar.png',
});
```

## Simple text only

```javascript
await webhook.send('Plain text message');
```

## Embeds without a title

Embeds can use only a description—no title required. At least one of title, description, fields, or image is needed.

```javascript
await webhook.send({
  embeds: [
    new EmbedBuilder()
      .setDescription('Description-only embed works.')
      .setColor(0x5865f2),
  ],
});
```

## Fetching & Listing Webhooks

Fetch by ID or list channel/guild webhooks. Requires a logged-in bot. Fetched webhooks have no token and cannot send—but you can edit or delete them with bot auth.

```javascript
import { Client, Webhook } from '@erinjs/core';

const client = new Client({ intents: 0 });
await client.login(process.env.ERIN_BOT_TOKEN);

// Fetch single webhook (no token)
const webhook = await Webhook.fetch(client, webhookId);

// List channel webhooks
const channel = client.channels.get(channelId);
const channelWebhooks = await channel?.fetchWebhooks() ?? [];

// List guild webhooks
const guild = client.guilds.get(guildId);
const guildWebhooks = await guild?.fetchWebhooks() ?? [];
```

## Editing a Webhook

Use webhook.edit() to change name, avatar, or (with bot auth) channel. With a token (e.g. from createWebhook or fromToken), you can update name and avatar. Without a token (fetched webhook), bot auth lets you also change the target channel.

```javascript
import { Client, Webhook } from '@erinjs/core';

const client = new Client({ intents: 0 });
await client.login(process.env.ERIN_BOT_TOKEN);

// With token (name and avatar only)
const webhook = Webhook.fromToken(client, webhookId, webhookToken);
await webhook.edit({ name: 'New Name', avatar: null });
// avatar: null clears the webhook avatar

// With bot auth (fetched webhook — can also move to another channel)
const fetched = await Webhook.fetch(client, webhookId);
await fetched.edit({
  name: 'Updated Name',
  channel_id: newChannelId,  // move webhook to different channel
});
```

## Deleting a Webhook

```javascript
const webhook = await Webhook.fetch(client, webhookId);
await webhook.delete();
```

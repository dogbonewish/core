# Deprecated APIs

APIs that are deprecated and will be removed in a future release. Migrate to the recommended alternatives.

## Overview

The following methods emit a one-time deprecation warning at runtime. Set ERIN_SUPPRESS_DEPRECATION=1 to silence warnings. Migrate to the recommended replacements.

## Client.sendToChannel

Use client.channels.send(channelId, payload) instead. Accepts the same MessageSendOptions (content, embeds, files).

| Deprecated | Replacement |
| --- | --- |
| `client.sendToChannel(channelId, content)` | `client.channels.send(channelId, payload)` |

```javascript
// ❌ Deprecated
await client.sendToChannel(channelId, 'Hello!');
await client.sendToChannel(channelId, { embeds: [embed] });

// ✅ Use instead
await client.channels.send(channelId, 'Hello!');
await client.channels.send(channelId, { embeds: [embed] });
```

## Client.fetchMessage

Use channel.messages.fetch(messageId) instead. Resolve the channel first if you only have IDs.

| Deprecated | Replacement |
| --- | --- |
| `client.fetchMessage(channelId, messageId)` | `(await client.channels.resolve(channelId))?.messages?.fetch(messageId)` |

```javascript
// ❌ Deprecated
const message = await client.fetchMessage(channelId, messageId);

// ✅ Use instead
const channel = await client.channels.resolve(channelId);
const message = channel?.messages ? await channel.messages.fetch(messageId) : null;
```

## ChannelManager.fetchMessage

Use channel.messages.fetch(messageId) instead.

| Deprecated | Replacement |
| --- | --- |
| `client.channels.fetchMessage(channelId, messageId)` | `channel.messages.fetch(messageId)` |

## Channel.fetchMessage

Use channel.messages.fetch(messageId) instead. Available on TextChannel and DMChannel.

| Deprecated | Replacement |
| --- | --- |
| `channel.fetchMessage(messageId)` | `channel.messages.fetch(messageId)` |

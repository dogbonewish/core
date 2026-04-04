# Events

Listen to gateway events with client.on. Handle messages, guild updates, voice state changes, and more.

## Basic Usage

Use client.on(Events.X, handler) to subscribe to events. Handlers receive event-specific payloads.

::: tip
client.events.X(handler) offers the same API with chaining and better autocomplete.
:::

::: code-group
```javascript [Default]
import { Client, Events } from '@erinjs/core';

const client = new Client({ intents: 0 });

client.on(Events.Ready, () => {
  console.log('Bot is ready!');
});

client.on(Events.MessageCreate, async (message) => {
  console.log(message.content);
});

await client.login(process.env.ERIN_BOT_TOKEN);
```
```javascript [client.events]
import { Client, Events } from '@erinjs/core';

const client = new Client({ intents: 0 });

client
  .events.Ready(() => console.log('Bot is ready!'))
  .events.MessageCreate(async (message) => console.log(message.content));

await client.login(process.env.ERIN_BOT_TOKEN);
```
:::

## Common Events

Essential events for most bots.

```javascript
// Bot finished loading
client.on(Events.Ready, () => {});

// New message (DM or guild)
client.on(Events.MessageCreate, async (message) => {});

// Reaction events
client.on(Events.MessageReactionAdd, (reaction, user, messageId, channelId, emoji, userId) => {});
client.on(Events.MessageReactionRemove, (reaction, user, messageId, channelId, emoji, userId) => {});

// Guild joined/left/updated
client.on(Events.GuildCreate, (guild) => {});
client.on(Events.GuildDelete, (guild) => {});

// Channel created/updated/deleted
client.on(Events.ChannelCreate, (channel) => {});
client.on(Events.ChannelDelete, (channel) => {});

// Member joined/left/updated
client.on(Events.GuildMemberAdd, (member) => {});
client.on(Events.GuildMemberRemove, (member) => {});

// Voice state changed (for @erinjs/voice)
client.on(Events.VoiceStateUpdate, (data) => {});
client.on(Events.VoiceServerUpdate, (data) => {});
```

## Reaction Events

Listen for when users add or remove reactions. Handlers receive (reaction, user, messageId, channelId, emoji, userId). Use MessageReactionRemoveAll and MessageReactionRemoveEmoji for moderator actions.

```javascript
import { Client, Events } from '@erinjs/core';

const client = new Client({ intents: 0 });

client.on(Events.MessageReactionAdd, (reaction, user, messageId, channelId, emoji, userId) => {
  const emojiStr = emoji.id ? `<:${emoji.name}:${emoji.id}>` : emoji.name;
  console.log(`User ${userId} reacted with ${emojiStr} on message ${messageId}`);

  // Filter for specific message (e.g. poll) or emoji
  if (emoji.name === '👍') {
    console.log('Someone voted yes!');
  }
});

client.on(Events.MessageReactionRemove, (reaction, user, messageId, channelId, emoji, userId) => {
  console.log(`User ${userId} removed ${emoji.name} from message ${messageId}`);
});

client.on(Events.MessageReactionRemoveAll, (data) => {
  console.log(`All reactions cleared from message ${data.message_id}`);
});

client.on(Events.MessageReactionRemoveEmoji, (data) => {
  console.log(`All ${data.emoji.name} reactions removed from message ${data.message_id}`);
});

await client.login(process.env.ERIN_BOT_TOKEN);
```

## Error Handling

```javascript
client.on(Events.Error, (err) => {
  console.error('Client error:', err);
});
```

## Gateway Dispatch Events Reference

All events the erin.js gateway can send. Use GatewayDispatchEvents from @erinjs/types for type-safe checks.

| Category | Events |
| --- | --- |
| Connection & Session | `Ready, Resumed, SessionsReplace` |
| User | `UserUpdate, UserSettingsUpdate, UserGuildSettingsUpdate, UserPinnedDmsUpdate, UserNoteUpdate, RecentMentionDelete` |
| Saved Messages & Auth | `SavedMessageCreate, SavedMessageDelete, AuthSessionChange` |
| Presence | `PresenceUpdate` |
| Guild | `GuildCreate, GuildUpdate, GuildDelete, GuildMemberAdd, GuildMemberUpdate, GuildMemberRemove, GuildMembersChunk, GuildMemberListUpdate, GuildSync` |
| Roles | `GuildRoleCreate, GuildRoleUpdate, GuildRoleUpdateBulk, GuildRoleDelete` |
| Guild Assets | `GuildEmojisUpdate, GuildStickersUpdate` |
| Moderation | `GuildBanAdd, GuildBanRemove` |
| Channels | `ChannelCreate, ChannelUpdate, ChannelUpdateBulk, ChannelDelete, ChannelRecipientAdd, ChannelRecipientRemove, ChannelPinsUpdate, ChannelPinsAck` |
| Passive | `PassiveUpdates` |
| Invites | `InviteCreate, InviteDelete` |
| Messages | `MessageCreate, MessageUpdate, MessageDelete, MessageDeleteBulk, MessageReactionAdd, MessageReactionRemove, MessageReactionRemoveAll, MessageReactionRemoveEmoji, MessageAck` |
| Typing | `TypingStart` |
| Webhooks | `WebhooksUpdate` |
| Relationships | `RelationshipAdd, RelationshipUpdate, RelationshipRemove` |
| Voice | `VoiceStateUpdate, VoiceServerUpdate` |
| Calls | `CallCreate, CallUpdate, CallDelete` |
| Favorites | `FavoriteMemeCreate, FavoriteMemeUpdate, FavoriteMemeDelete` |
| SDK / Compatibility | `InteractionCreate, GuildIntegrationsUpdate, GuildScheduledEventCreate, GuildScheduledEventUpdate, GuildScheduledEventDelete` |

## Event Payload Reference

Payload structure for each event. Handler receives (data) or (message), (reaction, user, ...) etc. Types: Gateway*DispatchData from @erinjs/types.

| Event | Payload |
| --- | --- |
| `READY` | `{ v, user, guilds, session_id, shard?, application: { id, flags } }` |
| `RESUMED` | `(no payload)` |
| `SESSIONS_REPLACE` | `Array of session objects` |
| `USER_UPDATE` | `APIUser — id, username, discriminator, global_name, avatar, etc.` |
| `GUILD_CREATE` | `APIGuild — id, name, icon, owner_id, channels[], members[], roles[], ...` |
| `GUILD_UPDATE` | `APIGuild — full guild object` |
| `GUILD_DELETE` | `{ id, unavailable? }` |
| `GUILD_MEMBER_ADD` | `APIGuildMember & { guild_id } — user, roles, nick, joined_at, ...` |
| `GUILD_MEMBER_UPDATE` | `{ guild_id, roles, user, nick?, avatar?, joined_at?, ... }` |
| `GUILD_MEMBER_REMOVE` | `{ guild_id, user }` |
| `GUILD_MEMBERS_CHUNK` | `{ guild_id, members[], chunk_index, chunk_count, presences?, nonce? }` |
| `GUILD_MEMBER_LIST_UPDATE` | `{ guild_id, id, member_count, online_count, groups[], ops[] }` |
| `GUILD_ROLE_CREATE` | `{ guild_id, role: APIRole }` |
| `GUILD_ROLE_UPDATE` | `{ guild_id, role: APIRole }` |
| `GUILD_ROLE_UPDATE_BULK` | `{ guild_id, roles: APIRole[] }` |
| `GUILD_ROLE_DELETE` | `{ guild_id, role_id }` |
| `GUILD_EMOJIS_UPDATE` | `{ guild_id, emojis: APIEmoji[] }` |
| `GUILD_STICKERS_UPDATE` | `{ guild_id, stickers: APISticker[] }` |
| `GUILD_BAN_ADD` | `{ guild_id, user, reason? }` |
| `GUILD_BAN_REMOVE` | `{ guild_id, user }` |
| `CHANNEL_CREATE` | `APIChannel — id, name, type, guild_id?, parent_id, ...` |
| `CHANNEL_UPDATE` | `APIChannel` |
| `CHANNEL_UPDATE_BULK` | `{ channels: APIChannel[] }` |
| `CHANNEL_DELETE` | `APIChannel` |
| `CHANNEL_RECIPIENT_ADD` | `{ channel_id, user }` |
| `CHANNEL_RECIPIENT_REMOVE` | `{ channel_id, user }` |
| `CHANNEL_PINS_UPDATE` | `{ channel_id, guild_id?, last_pin_timestamp? }` |
| `CHANNEL_PINS_ACK` | `{ channel_id, last_pin_timestamp? }` |
| `INVITE_CREATE` | `APIInvite — code, guild, channel, inviter?, expires_at?, ...` |
| `INVITE_DELETE` | `{ code, channel_id, guild_id? }` |
| `MESSAGE_CREATE` | `APIMessage — id, channel_id, author, content, embeds, attachments, member?, ...` |
| `MESSAGE_UPDATE` | `APIMessage — partial (edited fields)` |
| `MESSAGE_DELETE` | `{ id, channel_id, guild_id?, content?, author_id? }` |
| `MESSAGE_DELETE_BULK` | `{ ids[], channel_id, guild_id? }` |
| `MESSAGE_REACTION_ADD` | `{ message_id, channel_id, user_id, guild_id?, emoji: { id, name, animated? } }` |
| `MESSAGE_REACTION_REMOVE` | `{ message_id, channel_id, user_id, guild_id?, emoji }` |
| `MESSAGE_REACTION_REMOVE_ALL` | `{ message_id, channel_id, guild_id? }` |
| `MESSAGE_REACTION_REMOVE_EMOJI` | `{ message_id, channel_id, guild_id?, emoji }` |
| `MESSAGE_ACK` | `{ message_id, channel_id } — read receipt` |
| `TYPING_START` | `{ channel_id, user_id, timestamp, guild_id?, member? }` |
| `VOICE_STATE_UPDATE` | `{ guild_id?, channel_id, user_id, member?, session_id, deaf?, mute?, ... }` |
| `VOICE_SERVER_UPDATE` | `{ token, guild_id, endpoint, connection_id? }` |
| `WEBHOOKS_UPDATE` | `{ guild_id, channel_id }` |
| `PRESENCE_UPDATE` | `{ user: { id }, guild_id?, status?, activities?, custom_status? }` |
| `GUILD_INTEGRATIONS_UPDATE` | `{ guild_id }` |
| `GUILD_SCHEDULED_EVENT_CREATE` | `{ guild_id, id }` |
| `GUILD_SCHEDULED_EVENT_UPDATE` | `{ guild_id, id }` |
| `GUILD_SCHEDULED_EVENT_DELETE` | `{ guild_id, id }` |
| `USER_NOTE_UPDATE` | `{ id, note? }` |
| `SAVED_MESSAGE_CREATE` | `APIMessage` |
| `SAVED_MESSAGE_DELETE` | `{ id }` |
| `RELATIONSHIP_ADD / UPDATE` | `{ id, type }` |
| `RELATIONSHIP_REMOVE` | `{ id }` |
| `CALL_CREATE / UPDATE / DELETE` | `{ id, channel_id, ... }` |
| `INTERACTION_CREATE` | `APIApplicationCommandInteraction` |

# Reactions

Add, remove, and listen for message reactions with Message.react(), removeReaction(), and reaction events.

## Add a Reaction

Use message.react() to add an emoji reaction as the bot. Pass a unicode emoji string or custom emoji { name, id }.

```javascript
const reply = await message.reply('React to this!');
await reply.react('👍');
await reply.react({ name: 'customemoji', id: '123456789012345678' });
```

## Remove Reactions

Remove the bot's reaction with removeReaction(emoji). Remove a specific user's reaction with removeReaction(emoji, userId). Clear all reactions with removeAllReactions() or removeReactionEmoji(emoji).

```javascript
// Remove the bot's reaction
await message.removeReaction('👍');

// Remove a specific user's reaction (requires moderator permissions)
await message.removeReaction('👍', userId);

// Remove all reactions of one emoji from the message
await message.removeReactionEmoji('👍');

// Remove all reactions from the message
await message.removeAllReactions();
```

## Listen for Reactions

MessageReactionAdd and MessageReactionRemove emit (reaction, user, messageId, channelId, emoji, userId). Use client.on(Events.X, handler) or client.events.MessageReactionAdd(handler).

```javascript
client.on(Events.MessageReactionAdd, async (reaction, user, messageId, channelId, emoji, userId) => {
  if (emoji.name === '👍') {
    console.log(`User ${userId} voted yes on message ${messageId}`);
    const message = await reaction.fetchMessage();
    if (message) await message.react('✅');
  }
});

client.on(Events.MessageReactionRemove, (reaction, user, messageId, channelId, emoji, userId) => {
  console.log(`User ${userId} removed ${emoji.name} from message ${messageId}`);
});
```

## Reaction Roles Example

::: info Discord.js Compatible
See [API reference](/v/latest/api/classes/GuildMemberRoleManager) for full details.
:::

See examples/reaction-roles-bot.js for a full bot that assigns roles when users react to a message. Uses (reaction, user), Guild.fetchMember(), member.roles.add() (Discord.js parity), and guild.createRole() if you need to create roles programmatically. See the Roles guide for role CRUD.

```javascript
// Simplified reaction-roles logic
client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (!reaction.guildId || reaction.messageId !== rolesMessageId) return;
  const roleId = ROLE_EMOJI_MAP[reaction.emoji.name];
  if (!roleId) return;
  const guild = client.guilds.get(reaction.guildId);
  const member = await guild?.fetchMember(user.id);
  if (member && !member.roles.cache.has(roleId)) await member.roles.add(roleId);
});
```

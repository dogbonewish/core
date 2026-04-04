# Moderation

Implement ban, kick, and unban commands. Check permissions first (see Permissions guide).

## Overview

Use guild.ban(), guild.kick(), and guild.unban() for moderation. Always check member permissions before allowing moderation commands—see the Permissions guide.

## Ban a member

guild.ban(userId, options) bans a user. Pass reason for the audit log. Requires BanMembers permission.

```javascript
const userId = parseUserMention(target);
if (userId) {
  await guild.ban(userId, { reason: rest.join(' ') || undefined });
  await message.reply(`Banned <@${userId}>.`);
}
```

## Kick a member

guild.kick(userId, options) kicks a user from the guild. Pass reason for the audit log. Requires KickMembers permission.

```javascript
const userId = parseUserMention(target);
if (userId) {
  await guild.kick(userId, { reason: rest.join(' ') || undefined });
  await message.reply(`Kicked <@${userId}>.`);
}
```

## Unban a user

guild.unban(userId, reason?) removes a ban. Requires BanMembers permission.

```javascript
const userId = parseUserMention(target);
if (userId) {
  await guild.unban(userId, rest.join(' ') || undefined);
  await message.reply(`Unbanned <@${userId}>.`);
}
```

## Full moderation example

See examples/moderation-bot.js for a complete bot with !ban, !kick, !unban, and !perms commands.

```javascript
import { Client, Events, PermissionFlags, parseUserMention } from '@erinjs/core';

const PREFIX = '!';
const client = new Client({ intents: 0 });

async function getModeratorPerms(message) {
  const guild = message.guild ?? await message.client.guilds.resolve(message.guildId);
  if (!guild) return null;
  const member = guild.members.get(message.author.id);
  const resolved = member ?? await guild.fetchMember(message.author.id);
  return resolved?.permissions ?? null;
}

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.content?.startsWith(PREFIX)) return;
  const [cmd, target, ...rest] = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const perms = await getModeratorPerms(message);
  if (!perms) return;

  const guild = message.guild ?? await message.client.guilds.resolve(message.guildId);
  if (!guild) return;

  if (cmd === 'ban' && (perms.has(PermissionFlags.BanMembers) || perms.has(PermissionFlags.Administrator))) {
    const userId = parseUserMention(target);
    if (userId) {
      await guild.ban(userId, { reason: rest.join(' ') || undefined });
      await message.reply(`Banned <@${userId}>.`);
    }
  }
  if (cmd === 'kick' && (perms.has(PermissionFlags.KickMembers) || perms.has(PermissionFlags.Administrator))) {
    const userId = parseUserMention(target);
    if (userId) {
      await guild.kick(userId, { reason: rest.join(' ') || undefined });
      await message.reply(`Kicked <@${userId}>.`);
    }
  }
});

await client.login(process.env.ERIN_BOT_TOKEN);
```

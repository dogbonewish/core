# Discord.js Compatibility

APIs designed to ease migration from Discord.js. Look for the green "Discord.js compatible" badge in guides.

## Overview

erin.js SDK provides Discord.js-style APIs where it makes sense. Sections marked with the green "Discord.js compatible" badge offer familiar patterns — click the badge to see the full API reference.

## member.roles (GuildMemberRoleManager)

::: info Discord.js Compatible
See [API reference](/v/latest/api/classes/GuildMemberRoleManager) for full details.
:::

member.roles is a manager with add(), remove(), set(), and cache. Use member.roles.add(roleId), member.roles.remove(roleId), member.roles.set(roleIds), and member.roles.cache.has(roleId) instead of the old member.addRole() / member.roles.includes() pattern.

```javascript
// Discord.js style
await member.roles.add(roleId);
await member.roles.remove(roleId);
await member.roles.set(['id1', 'id2']);
if (member.roles.cache.has(roleId)) { ... }
```

## guild.members.me

::: info Discord.js Compatible
See [API reference](/v/latest/api/classes/GuildMemberManager) for full details.
:::

guild.members.me returns the bot's GuildMember in that guild. Use guild.members.fetchMe() to load it when not cached. Same as Discord.js.

```javascript
const me = guild.members.me ?? await guild.members.fetchMe();
if (me?.permissions.has(PermissionFlags.BanMembers)) {
  await message.reply('I can ban members here.');
}
```

## Other parity

client.channels.cache and client.guilds.cache are compatibility aliases. Collection extends Map with find(), filter(), etc. See the API reference for full details.

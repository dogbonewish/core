# Wait for All Guilds

Delay the Ready event until all guilds have been received. Use when your bot needs the full guild cache before handling Ready.

## Overview

By default, Ready fires as soon as the gateway sends the READY payload. Some guilds may be sent as unavailable stubs and arrive later via GUILD_CREATE. Enable waitForGuilds if your Ready handler needs every guild to be in client.guilds before proceeding.

## Usage

Pass waitForGuilds: true in ClientOptions. Ready will emit only after all guilds from READY (including those marked unavailable) have been received via GUILD_CREATE.

```javascript
import { Client, Events } from '@erinjs/core';

const client = new Client({
  waitForGuilds: true,
});

client.on(Events.Ready, () => {
  // client.guilds now contains every guild — no stubs, all fully loaded
  console.log(`Bot is in ${client.guilds.size} guilds`);
  for (const [id, guild] of client.guilds) {
    console.log(`- ${guild.name} (${guild.channels.size} channels)`);
  }
});

await client.login(process.env.ERIN_BOT_TOKEN);
```

## When to use it

Use waitForGuilds when your bot iterates over all guilds in Ready (e.g. syncing state, broadcasting announcements, or building in-memory caches). Without it, client.guilds may be incomplete at Ready time.

::: tip
If you only need a few guilds by ID, prefer client.guilds.resolve(guildId) instead — no need to wait for all guilds.
:::

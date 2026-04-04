# GIFs (Tenor)

Send Tenor GIFs as content (gifv) or in embeds using resolveTenorToImageUrl() for GIF URLs.

## How Tenor GIFs Work

Tenor embeds are created by the erin.js unfurler when you send a Tenor URL as message content. Do not use custom embeds for Tenor GIFs—the API turns the URL into a type: "gifv" embed.

## Send a Tenor GIF

Send the Tenor URL as content. No embeds needed. The unfurler detects the URL and creates the gifv embed.

```javascript
import { Client, Events } from '@erinjs/core';

const client = new Client({ intents: 0 });

client.on(Events.MessageCreate, async (message) => {
  if (message.content === '!gif') {
    const tenorUrl = 'https://tenor.com/view/stressed-gif-7048057395502071840';
    await message.reply({ content: tenorUrl });
  }
});
```

## Tenor URL in an embed

Tenor page URLs do not work as setImage() URLs. Use resolveTenorToImageUrl() to fetch the Tenor page or oEmbed, derive the GIF URL (embeds require GIF, not MP4), and return { url, flags: IS_ANIMATED }. For full gifv embeds, send the Tenor URL as content.

```javascript
import { EmbedBuilder, resolveTenorToImageUrl } from '@erinjs/core';

const tenorUrl = 'https://tenor.com/view/stressed-gif-7048057395502071840';
const media = await resolveTenorToImageUrl(tenorUrl);
if (media) {
  const embed = new EmbedBuilder()
    .setTitle('Tenor in embed')
    .setDescription('GIF URL + IS_ANIMATED flag')
    .setImage(media)
    .setColor(0x5865f2);
  await message.reply({ embeds: [embed] });
}
```

## Important

Custom embeds cannot create gifv embeds. For full animated gifv, send the Tenor URL as content. resolveTenorToImageUrl() returns GIF URL + IS_ANIMATED (derived from media.tenor.com path).

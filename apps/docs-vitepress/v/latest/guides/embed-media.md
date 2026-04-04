# Embed Media

Add images, thumbnails, video, and audio to embeds with EmbedBuilder and EmbedMediaOptions.

## Images and Thumbnails

Use setImage() and setThumbnail() with a URL string, or pass full EmbedMediaOptions for width, height, content_type, and other metadata.

```javascript
import { Client, Events, EmbedBuilder } from '@erinjs/core';

const client = new Client({ intents: 0 });

client.on(Events.MessageCreate, async (message) => {
  if (message.content === '!embedimg') {
    const embed = new EmbedBuilder()
      .setTitle('Image Embed')
      .setDescription('Simple image from URL.')
      .setImage('https://placehold.co/400x200/5865f2/white?text=Image')
      .setThumbnail('https://placehold.co/100x100/57f287/white?text=Thumb')
      .setColor(0x5865f2);

    await message.reply({ embeds: [embed] });
  }
});
```

## Image with Full Media Options

Pass an object to setImage or setThumbnail with url, width, height, content_type, description, placeholder, duration, and flags. Use EmbedMediaFlags.IS_ANIMATED for animated GIFs.

```javascript
const embed = new EmbedBuilder()
  .setTitle('Image with metadata')
  .setDescription('EmbedMediaOptions: width, height')
  .setImage({
    url: 'https://placehold.co/400x200/5865f2/white?text=Image',
    width: 400,
    height: 200,
    content_type: 'image/png',
  })
  .setColor(0x5865f2);
```

## GIFs in embeds

Embeds require GIF format for animated images (not MP4). Add EmbedMediaFlags.IS_ANIMATED to the flags field. For Tenor URLs, use resolveTenorToImageUrl() to get the GIF URL and flag — see the GIFs (Tenor) guide.

## Video in Embeds

Use setVideo() to add video to a rich embed. erin.js supports the .video field. Include a title when using video. Pass a URL or EmbedMediaOptions (e.g. duration for progress bars).

```javascript
const embed = new EmbedBuilder()
  .setTitle('Video embed')
  .setDescription('Rich embed with video field.')
  .setVideo('https://example.com/sample.mp4')
  .setURL('https://example.com/sample.mp4')
  .setColor(0x5865f2);

// With full options (duration, dimensions for progress bar):
const embedWithDuration = new EmbedBuilder()
  .setTitle('Video with metadata')
  .setVideo({
    url: 'https://example.com/video.mp4',
    duration: 120,
    width: 1280,
    height: 720,
  })
  .setColor(0x5865f2);
```

## Audio in Embeds

Use setAudio() to add audio to an embed. Pass a URL or EmbedMediaOptions (e.g. duration, content_type).

```javascript
const embed = new EmbedBuilder()
  .setTitle('Audio embed')
  .setDescription('Rich embed with audio field.')
  .setAudio({
    url: 'https://example.com/sample.mp3',
    duration: 180,
    content_type: 'audio/mpeg',
  })
  .setColor(0x5865f2);
```

import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";
import { igdl } from 'ruhend-scraper';
const processedMessages = new Set();
function extractUniqueMedia(mediaData) {
  const uniqueMedia = [];
  const seenUrls = new Set();
  
  for (const media of mediaData) {
    if (!media.url) continue;
    if (!seenUrls.has(media.url)) {
      seenUrls.add(media.url);
      uniqueMedia.push(media);
    }
  }
  return uniqueMedia;
}

function getMessageText(message) {
  if (message.body) return message.body;
  if (message.message?.conversation) return message.message.conversation;
  if (message.message?.extendedTextMessage?.text) return message.message.extendedTextMessage.text;
  return '';
}

export default async function instagramCommand(message, client) {
  const chat = message.key.remoteJid;
  const text = getMessageText(message);
  if (processedMessages.has(message.key.id)) return;
  processedMessages.add(message.key.id);
  setTimeout(() => processedMessages.delete(message.key.id), 5 * 60 * 1000);

  if (!text) {
    return await client.sendMessage(chat, {
      text: '> ❌ Veuillez fournir un lien Instagram (post, reel, tv).', ...channelInfo
    }, { quoted: fakeQuoted });
  }

  const instagramPatterns = [
    /https?:\/\/(?:www\.)?instagram\.com\//,
    /https?:\/\/(?:www\.)?instagr\.am\//,
    /https?:\/\/(?:www\.)?instagram\.com\/p\//,
    /https?:\/\/(?:www\.)?instagram\.com\/reel\//,
    /https?:\/\/(?:www\.)?instagram\.com\/tv\//
  ];

  const isValidUrl = instagramPatterns.some(pattern => pattern.test(text));
  if (!isValidUrl) {
    return await client.sendMessage(chat, {
      text: '> *❌ Lien Instagram invalide. Utilise un lien de post, reel ou tv.*', ... channelInfo
    }, { quoted: fakeQuoted });
  }

  await client.sendMessage(chat, {
    react: { text: '🫟', key: message.key }
  });

  try {
    const downloadData = await igdl(text);
    
    if (!downloadData || !downloadData.data || downloadData.data.length === 0) {
      return await client.sendMessage(chat, {
        text: '> ❌ Aucun média trouvé. Le post est peut-être privé ou le lien invalide.', ...channelInfo
      }, { quoted: fakeQuoted });
    }

    const uniqueMedia = extractUniqueMedia(downloadData.data);
    const mediaToDownload = uniqueMedia.slice(0, 20);

    if (mediaToDownload.length === 0) {
      return await client.sendMessage(chat, {
        text: '> *❌ Aucun média valide trouvé.*', ...channelInfo
      }, { quoted: fakeQuoted });
    }

    for (let i = 0; i < mediaToDownload.length; i++) {
      try {
        const media = mediaToDownload[i];
        const mediaUrl = media.url;
        const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl) ||
                        media.type === 'video' ||
                        text.includes('/reel/') ||
                        text.includes('/tv/');

        if (isVideo) {
          await client.sendMessage(chat, {
            video: { url: mediaUrl },
            mimetype: 'video/mp4',
            caption: '📥 *DOWNLOADED BY SARADA MD V3*', ...channelInfo
          }, { quoted: fakeQuoted });
        } else {
          await client.sendMessage(chat, {
            image: { url: mediaUrl },
            caption: '> 📥 *DOWNLOADED BY SARADA MD V3*', ...channelInfo
          }, { quoted: fakeQuoted });
        }

        if (i < mediaToDownload.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (mediaError) {
        console.error(`Erreur média ${i + 1}:`, mediaError.message);
      }
    }
  } catch (error) {
    console.error('[Instagram] Erreur:', error.message);
    await client.sendMessage(chat, {
      text: `> ❌ Erreur : ${error.message}`, ...channelInfo
    }, { quoted: fakeQuoted });
  }
}
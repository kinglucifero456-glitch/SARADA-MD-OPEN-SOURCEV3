import axios from 'axios';
import yts from 'yt-search';
import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";

const AXIOS_DEFAULTS = {
  timeout: 60000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*'
  }
};

async function tryRequest(getter, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await getter();
    } catch (err) {
      lastError = err;
      if (attempt < attempts) await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
  throw lastError;
}

async function getEliteProTechVideoByUrl(youtubeUrl) {
  const apiUrl = `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(youtubeUrl)}&format=mp4`;
  const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
  if (res?.data?.success && res?.data?.downloadURL) {
    return { download: res.data.downloadURL, title: res.data.title };
  }
  throw new Error('EliteProTech ytdown returned no download');
}

async function getYupraVideoByUrl(youtubeUrl) {
  const apiUrl = `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;
  const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
  if (res?.data?.success && res?.data?.data?.download_url) {
    return { download: res.data.data.download_url, title: res.data.data.title, thumbnail: res.data.data.thumbnail };
  }
  throw new Error('Yupra returned no download');
}

async function getOkatsuVideoByUrl(youtubeUrl) {
  const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;
  const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
  if (res?.data?.result?.mp4) {
    return { download: res.data.result.mp4, title: res.data.result.title };
  }
  throw new Error('Okatsu ytmp4 returned no mp4');
}

function getMessageText(message) {
  if (message.body) return message.body;
  if (message.message?.conversation) return message.message.conversation;
  if (message.message?.extendedTextMessage?.text) return message.message.extendedTextMessage.text;
  return '';
}

export default async function youtubeCommand(message, client) {
  const chat = message.key.remoteJid;
  const fullText = getMessageText(message);

  if (!fullText) {
    return await client.sendMessage(chat, {
      text: '❌ Usage: !youtube <lien YouTube ou recherche>', ...channelInfo
    }, { quoted: fakeQuoted });
  }

  const searchQuery = fullText.split(/\s+/).slice(1).join(' ').trim();
  if (!searchQuery) {
    return await client.sendMessage(chat, {
      text: '❌ Que veux-tu télécharger ? (lien ou nom de vidéo)', ...channelInfo
    }, { quoted: fakeQuoted });
  }

  try {
    let videoUrl = '';
    let videoTitle = '';
    let videoThumbnail = '';

    if (searchQuery.startsWith('http://') || searchQuery.startsWith('https://')) {
      videoUrl = searchQuery;
    } else {
      const { videos } = await yts(searchQuery);
      if (!videos || videos.length === 0) {
        return await client.sendMessage(chat, {
          text: '❌ Aucune vidéo trouvée.', ...channelInfo
        }, { quoted: fakeQuoted });
      }
      videoUrl = videos[0].url;
      videoTitle = videos[0].title;
      videoThumbnail = videos[0].thumbnail;
    }

    try {
      const ytId = (videoUrl.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/) || [])[1];
      const thumb = videoThumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/sddefault.jpg` : null);
      const captionTitle = videoTitle || searchQuery;
      if (thumb) {
        await client.sendMessage(chat, {
          image: { url: thumb },
          caption: `> 🎬 *${captionTitle}*\n⏳ Téléchargement en cours...`, ...channelInfo
        }, { quoted: fakeQuoted });
      }
    } catch (e) {
      console.error('[YouTube] Thumb error:', e.message);
    }

    const urlMatch = videoUrl.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/i);
    if (!urlMatch) {
      return await client.sendMessage(chat, {
        text: '> ❌ Lien YouTube invalide.', ...channelInfo
      }, { quoted: message });
    }

    let videoData;
    let downloadSuccess = false;

    const apiMethods = [
      { name: 'EliteProTech', method: () => getEliteProTechVideoByUrl(videoUrl) },
      { name: 'Yupra', method: () => getYupraVideoByUrl(videoUrl) },
      { name: 'Okatsu', method: () => getOkatsuVideoByUrl(videoUrl) }
    ];

    for (const apiMethod of apiMethods) {
      try {
        videoData = await apiMethod.method();
        const videoUrlCheck = videoData.download || videoData.dl || videoData.url;
        if (videoUrlCheck) {
          downloadSuccess = true;
          break;
        }
      } catch (apiErr) {
        console.log(`${apiMethod.name} API failed:`, apiErr.message);
      }
    }

    if (!downloadSuccess || !videoData) {
      throw new Error('All download sources failed.');
    }

    await client.sendMessage(chat, {
      video: { url: videoData.download || videoData.dl || videoData.url },
      mimetype: 'video/mp4',
      fileName: `${(videoData.title || videoTitle || 'video').replace(/[^\w\s-]/g, '')}.mp4`,
      caption: `🎬 *${videoData.title || videoTitle || 'Video'}*\n\n> 📥 *DOWNLOADED BY SARADA MD V3*`
    }, { quoted: message });

  } catch (error) {
    console.error('[YouTube] Erreur:', error.message);
    let errorMessage = '❌ Échec du téléchargement.';
    if (error.message?.includes('blocked') || error.message?.includes('451')) {
      errorMessage = '❌ Contenu indisponible (bloqué ou restreint).';
    } else if (error.message?.includes('All download sources failed')) {
      errorMessage = '❌ Toutes les sources ont échoué. Le contenu est peut-être indisponible.';
    } else if (error.message) {
      errorMessage = `❌ Erreur : ${error.message}`;
    }
    await client.sendMessage(chat, {
      text: errorMessage
    }, { quoted: message });
  }
}
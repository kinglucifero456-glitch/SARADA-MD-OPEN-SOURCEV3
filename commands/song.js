import axios from 'axios';
import yts from 'yt-search';
import fs from 'fs';
import path from 'path';
import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";
import { toAudio } from '../lib/converter.js';

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

async function getEliteProTechDownloadByUrl(youtubeUrl) {
  const apiUrl = `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(youtubeUrl)}&format=mp3`;
  const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
  if (res?.data?.success && res?.data?.downloadURL) {
    return { download: res.data.downloadURL, title: res.data.title };
  }
  throw new Error('EliteProTech ytdown returned no download');
}

async function getYupraDownloadByUrl(youtubeUrl) {
  const apiUrl = `https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(youtubeUrl)}`;
  const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
  if (res?.data?.success && res?.data?.data?.download_url) {
    return { download: res.data.data.download_url, title: res.data.data.title, thumbnail: res.data.data.thumbnail };
  }
  throw new Error('Yupra returned no download');
}

async function getOkatsuDownloadByUrl(youtubeUrl) {
  const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp3?url=${encodeURIComponent(youtubeUrl)}`;
  const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
  if (res?.data?.dl) {
    return { download: res.data.dl, title: res.data.title, thumbnail: res.data.thumb };
  }
  throw new Error('Okatsu ytmp3 returned no download');
}

function getMessageText(message) {
  if (message.body) return message.body;
  if (message.message?.conversation) return message.message.conversation;
  if (message.message?.extendedTextMessage?.text) return message.message.extendedTextMessage.text;
  if (message.message?.imageMessage?.caption) return message.message.imageMessage.caption;
  if (message.message?.videoMessage?.caption) return message.message.videoMessage.caption;
  return '';
}

export default async function songCommand(message, client) {
  const chat = message.key.remoteJid;
  const text = getMessageText(message);

  if (!text) {
    await client.sendMessage(chat, { text: '> *❌ Usage: !song <nom de la chanson ou lien YouTube>*', ...channelInfo }, { quoted: fakeQuoted });
    return;
  }

  let video;
  if (text.includes('youtube.com') || text.includes('youtu.be')) {
    video = { url: text };
  } else {
    const search = await yts(text);
    if (!search || !search.videos.length) {
      await client.sendMessage(chat, { text: '> *❌ Aucun résultat trouvé.*', ...channelInfo }, { quoted: fakeQuoted });
      return;
    }
    video = search.videos[0];
  }

  await client.sendMessage(chat, {
    image: { url: video.thumbnail },
    caption: `⎿⎋⏋ *𝐓𝐞́𝐥𝐞́𝐜𝐡𝐚𝐫𝐠𝐞𝐦𝐞𝐧𝐭 :* ${video.title}\n⎿⎋⏋ *𝐃𝐮𝐫𝐞́𝐞 :* ${video.timestamp}`, ...channelInfo
  }, { quoted: message });

  let audioData;
  let audioBuffer;
  let downloadSuccess = false;

  const apiMethods = [
    { name: 'EliteProTech', method: () => getEliteProTechDownloadByUrl(video.url) },
    { name: 'Yupra', method: () => getYupraDownloadByUrl(video.url) },
    { name: 'Okatsu', method: () => getOkatsuDownloadByUrl(video.url) }
  ];

  for (const apiMethod of apiMethods) {
    try {
      audioData = await apiMethod.method();
      const audioUrl = audioData.download || audioData.dl || audioData.url;
      if (!audioUrl) continue;

      const audioResponse = await axios.get(audioUrl, {
        responseType: 'arraybuffer',
        timeout: 90000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        decompress: true,
        validateStatus: s => s >= 200 && s < 400,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Accept-Encoding': 'identity'
        }
      });
      audioBuffer = Buffer.from(audioResponse.data);
      if (audioBuffer && audioBuffer.length > 0) {
        downloadSuccess = true;
        break;
      }
    } catch (err) {
      console.log(`${apiMethod.name} a échoué :`, err.message);
      continue;
    }
  }

  if (!downloadSuccess || !audioBuffer) {
    await client.sendMessage(chat, { text: '> ❌ Échec du téléchargement. Le contenu est peut-être indisponible ou bloqué.', ...channelInfo }, { quoted: fakeQuoted });
    return;
  }

  const firstBytes = audioBuffer.slice(0, 12);
  const asciiSignature = firstBytes.toString('ascii', 4, 8);
  let fileExtension = 'mp3';

  if (asciiSignature === 'ftyp') {
    fileExtension = 'm4a';
  } else if (audioBuffer.toString('ascii', 0, 3) === 'ID3' || (audioBuffer[0] === 0xFF && (audioBuffer[1] & 0xE0) === 0xE0)) {
    fileExtension = 'mp3';
  } else if (audioBuffer.toString('ascii', 0, 4) === 'OggS') {
    fileExtension = 'ogg';
  } else if (audioBuffer.toString('ascii', 0, 4) === 'RIFF') {
    fileExtension = 'wav';
  } else {
    fileExtension = 'm4a';
  }

  let finalBuffer = audioBuffer;
  if (fileExtension !== 'mp3') {
    try {
      finalBuffer = await toAudio(audioBuffer, fileExtension);
    } catch (convErr) {
      await client.sendMessage(chat, { text: `> *❌ Erreur de conversion : ${convErr.message}*`, ...channelInfo }, { quoted: fakeQuoted });
      return;
    }
  }

  await client.sendMessage(chat, {
    audio: finalBuffer,
    mimetype: 'audio/mpeg',
    fileName: `${(audioData.title || video.title || 'song').replace(/[^\w\s-]/g, '')}.mp3`,
    ptt: false
  }, { quoted: message });

  try {
    const tempDir = path.join(process.cwd(), 'temp');
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      const now = Date.now();
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        try {
          const stats = fs.statSync(filePath);
          if (now - stats.mtimeMs > 10000 && (file.endsWith('.mp3') || file.endsWith('.m4a') || /^\d+\.(mp3|m4a)$/.test(file))) {
            fs.unlinkSync(filePath);
          }
        } catch (e) {}
      });
    }
  } catch (e) {}
}
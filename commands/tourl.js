import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';
import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";
import { UploadFileUgu, TelegraPh } from '../lib/uploader.js';

async function getMediaBufferAndExt(message) {
  const m = message.message || {};
  if (m.imageMessage) {
    const stream = await downloadContentFromMessage(m.imageMessage, 'image');
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return { buffer: Buffer.concat(chunks), ext: '.jpg' };
  }
  if (m.videoMessage) {
    const stream = await downloadContentFromMessage(m.videoMessage, 'video');
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return { buffer: Buffer.concat(chunks), ext: '.mp4' };
  }
  if (m.audioMessage) {
    const stream = await downloadContentFromMessage(m.audioMessage, 'audio');
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return { buffer: Buffer.concat(chunks), ext: '.mp3' };
  }
  if (m.documentMessage) {
    const stream = await downloadContentFromMessage(m.documentMessage, 'document');
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const fileName = m.documentMessage.fileName || 'file.bin';
    const ext = path.extname(fileName) || '.bin';
    return { buffer: Buffer.concat(chunks), ext };
  }
  if (m.stickerMessage) {
    const stream = await downloadContentFromMessage(m.stickerMessage, 'sticker');
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return { buffer: Buffer.concat(chunks), ext: '.webp' };
  }
  return null;
}

async function getQuotedMediaBufferAndExt(message) {
  const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
  if (!quoted) return null;
  return getMediaBufferAndExt({ message: quoted });
}

export default async function tourlCommand(message, client) {
  const chat = message.key.remoteJid;

  let media = await getMediaBufferAndExt(message);
  if (!media) media = await getQuotedMediaBufferAndExt(message);

  if (!media) {
    await client.sendMessage(chat, { text: '> *❌ Envoyez ou répondez à un média (image, vidéo, audio, sticker, document) pour obtenir une URL.*' }, { quoted: fakeQuoted });
    return;
  }

  const tempDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  const tempPath = path.join(tempDir, `${Date.now()}${media.ext}`);
  fs.writeFileSync(tempPath, media.buffer);

  let url = '';
  try {
    if (media.ext === '.jpg' || media.ext === '.png' || media.ext === '.webp') {
      try {
        url = await TelegraPh(tempPath);
      } catch {
        const res = await UploadFileUgu(tempPath);
        url = typeof res === 'string' ? res : (res.url || res.url_full || JSON.stringify(res));
      }
    } else {
      const res = await UploadFileUgu(tempPath);
      url = typeof res === 'string' ? res : (res.url || res.url_full || JSON.stringify(res));
    }
  } finally {
    setTimeout(() => {
      try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch {}
    }, 2000);
  }

  if (!url) {
    await client.sendMessage(chat, { text: '> *❌ Échec de l’upload.*' }, { quoted: fakeQuoted });
    return;
  }

  await client.sendMessage(chat, { text: `🇭🇰⃟🇦🇱 *URL :* ${url} 🇭🇰⃟🇦🇱`, ...channelInfo }, { quoted: fakeQuoted });
}
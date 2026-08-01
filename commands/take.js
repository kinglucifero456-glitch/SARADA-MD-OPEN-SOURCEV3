import { downloadMediaMessage } from '@whiskeysockets/baileys';
import sharp from 'sharp';
import { channelInfo } from '../lib/messageConfig.js';
import { fakeQuoted } from '../lib/fquoted.js';
export default async function takeCommand(message, client) {
  const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (!quotedMsg || !quotedMsg.stickerMessage) {
    return client.sendMessage(message.key.remoteJid, {
      text: '> *❌ 𝐑𝐄́𝐏𝐎𝐍𝐃𝐄𝐙 𝐀̀ 𝐔𝐍 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 𝐀𝐕𝐄𝐂 !take*',
      ...channelInfo,
    }, { quoted: message });
  }

  const stickerBuffer = await downloadMediaMessage(
    { message: { stickerMessage: quotedMsg.stickerMessage } },
    'buffer',
    {},
    { logger: client.logger, reuploadRequest: client.updateMediaMessage }
  );

  
  const packname = 'SARADA-MD BOT • PACK';
  const author = message.pushName || 'Utilisateur';

  
  const webpBuffer = await sharp(stickerBuffer)
    .webp({ quality: 80 })
    .toBuffer();

  await client.sendMessage(message.key.remoteJid, {
    sticker: webpBuffer,
    mimetype: 'image/webp',
    packname,
    author,
  }, { quoted: fakeQuoted });
}
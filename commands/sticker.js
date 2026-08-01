import { downloadMediaMessage } from '@whiskeysockets/baileys';
import sharp from 'sharp';
import { channelInfo } from '../lib/messageConfig.js';
import { fakeQuoted } from '../lib/fquoted.js';

export default async function stickerCommand(message, client) {
  const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (!quotedMsg) {
    return client.sendMessage(message.key.remoteJid, {
      text: '> *❌ 𝐑𝐄́𝐏𝐎𝐍𝐃𝐄𝐙 𝐀̀ 𝐔𝐍𝐄 𝐈𝐌𝐀𝐆𝐄/𝐕𝐈𝐃𝐄́𝐎/𝐆𝐈𝐅 𝐀𝐕𝐄𝐂 !sticker*',
      ...channelInfo,
    }, { quoted: fakeQuoted });
  }

  let mediaType = null;
  let mediaMessage = null;
  if (quotedMsg.imageMessage) {
    mediaType = 'image';
    mediaMessage = quotedMsg.imageMessage;
  } else if (quotedMsg.videoMessage) {
    mediaType = 'video';
    mediaMessage = quotedMsg.videoMessage;
  } else if (quotedMsg.gifMessage) {
    mediaType = 'gif';
    mediaMessage = quotedMsg.gifMessage;
  }

  if (!mediaType) {
    return client.sendMessage(message.key.remoteJid, {
      text: '*❌ 𝐂𝐄 𝐌𝐄𝐒𝐒𝐀𝐆𝐄 𝐍\'𝐄𝐒𝐓 𝐏𝐀𝐒 𝐔𝐍 𝐌𝐄́𝐃𝐈𝐀 𝐂𝐎𝐍𝐕𝐄𝐑𝐓𝐈𝐁𝐋𝐄 𝐄𝐍 𝐒𝐓𝐈𝐂𝐊𝐄𝐑.*',
      ...channelInfo,
    }, { quoted: fakeQuoted });
  }

  const buffer = await downloadMediaMessage(
    { message: { [mediaType + 'Message']: mediaMessage } },
    'buffer',
    {},
    { logger: client.logger, reuploadRequest: client.updateMediaMessage }
  );

  
  let stickerBuffer;
  if (mediaType === 'image') {
    stickerBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
  } else {
    
    return client.sendMessage(message.key.remoteJid, {
      text: '> *❌ 𝐂𝐎𝐍𝐕𝐄𝐑𝐒𝐈𝐎𝐍 𝐕𝐈𝐃𝐄́𝐎/𝐆𝐈𝐅 𝐄𝐍 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 𝐍𝐎𝐍 𝐈𝐌𝐏𝐋𝐄𝐌𝐄𝐍𝐓𝐄́𝐄 (𝐏𝐀𝐒 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄 𝐃𝐀𝐍𝐒 𝐋𝐀 𝐕3.3).*',
      ...channelInfo,
    }, { quoted: message });
  }

  const packname = 'SARADA-MD BOT • PACK';
  const author = message.pushName || 'Utilisateur';

  await client.sendMessage(message.key.remoteJid, {
    sticker: stickerBuffer,
    mimetype: 'image/webp',
    packname,
    author,
    ...channelInfo,
  },
   { quoted: fakeQuoted });
}
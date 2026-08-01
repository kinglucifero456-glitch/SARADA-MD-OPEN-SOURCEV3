import { channelInfo } from '../lib/messageConfig.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default async function viewonceCommand(message, client) {
  const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (!quotedMsg) {
    return client.sendMessage(message.key.remoteJid, {
      text: '> *❌ Répondez à un message viewonce (image/vidéo/audio) avec la commande !vv*',
      ...channelInfo,
    }, { quoted: message });
  }

  let mediaType = null;
  let mediaMessage = null;
  if (quotedMsg.imageMessage?.viewOnce) mediaType = 'image', mediaMessage = quotedMsg.imageMessage;
  else if (quotedMsg.videoMessage?.viewOnce) mediaType = 'video', mediaMessage = quotedMsg.videoMessage;
  else if (quotedMsg.audioMessage?.viewOnce) mediaType = 'audio', mediaMessage = quotedMsg.audioMessage;

  if (!mediaType) {
    return client.sendMessage(message.key.remoteJid, {
      text: '> *❌ Ce message n’est pas un viewonce valide.*',
      ...channelInfo,
    }, { quoted: message });
  }

  
  const buffer = await downloadMediaMessage(
    { message: { [mediaType + 'Message']: mediaMessage } },
    'buffer',
    {},
    { logger: client.logger, reuploadRequest: client.updateMediaMessage }
  );

  const caption = mediaMessage.caption || '';
  const sendOptions = { caption, ...channelInfo };
  if (mediaType === 'image') {
    await client.sendMessage(message.key.remoteJid, { image: buffer, ...sendOptions });
  } else if (mediaType === 'video') {
    await client.sendMessage(message.key.remoteJid, { video: buffer, ...sendOptions });
  } else if (mediaType === 'audio') {
    await client.sendMessage(message.key.remoteJid, { audio: buffer, mimetype: 'audio/mp4', ...sendOptions });
  }
}
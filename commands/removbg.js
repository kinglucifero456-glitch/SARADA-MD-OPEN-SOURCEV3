import axios from 'axios';
import FormData from 'form-data';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { channelInfo } from '../lib/messageConfig.js';

const API_URL = 'https://api.shizo.top/tools/removebg';
const API_KEY = 'shizo'; 

export default async function removbgCommand(message, client) {
  const chatId = message.key.remoteJid;
  const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

  if (!quoted || !quoted.imageMessage) {
    return client.sendMessage(chatId, {
      text: '> *❌ 𝐑𝐄́𝐏𝐎𝐍𝐃𝐒 𝐀̀ 𝐔𝐍𝐄 𝐈𝐌𝐀𝐆𝐄 𝐀𝐕𝐄𝐂: !removbg*',
      ...channelInfo,
    }, { quoted: message });
  }

  try {
    await client.sendMessage(chatId, {
      text: '*⏳ 𝐒𝐔𝐏𝐏𝐑𝐄𝐒𝐒𝐈𝐎𝐍 𝐃𝐄 𝐋\'𝐀𝐑𝐑𝐈𝐄̀𝐑𝐄 𝐏𝐋𝐀𝐍 𝐄𝐍 𝐂𝐎𝐔𝐑𝐒...*',
      ...channelInfo,
    }, { quoted: message });

    
    const imageBuffer = await downloadMediaMessage(
      { message: { imageMessage: quoted.imageMessage } },
      'buffer',
      {},
      { logger: client.logger, reuploadRequest: client.updateMediaMessage }
    );

    
    const form = new FormData();
    form.append('image', imageBuffer, { filename: 'image.jpg' });
    form.append('apikey', API_KEY);

    const response = await axios.post(API_URL, form, {
      headers: {
        ...form.getHeaders(),
      },
      responseType: 'arraybuffer', 
    });

    
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/json')) {
      const error = JSON.parse(response.data.toString());
      throw new Error(error.msg || 'Erreur API');
    }

    
    await client.sendMessage(chatId, {
      image: Buffer.from(response.data),
      caption: '*🖼️ 𝐀𝐑𝐑𝐈𝐄̀𝐑𝐄 𝐏𝐋𝐀𝐍 𝐒𝐔𝐏𝐏𝐑𝐈𝐌𝐄́ !*',
      ...channelInfo,
    }, { quoted: message });
  } catch (err) {
    console.error('RemoveBG error:', err.message);
    const errorMsg = err.response?.data?.msg || err.message;
    await client.sendMessage(chatId, {
      text: `> *❌ 𝐄𝐑𝐑𝐄𝐔𝐑 : ${errorMsg}\n𝐅𝐀𝐈𝐒 𝐔𝐍𝐄 𝐕𝐄́𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍 𝐃𝐔 𝐅𝐎𝐑𝐌𝐀𝐓 𝐃𝐄 𝐋'𝐈𝐌𝐀𝐆𝐄 𝐎𝐔 𝐋'𝐀𝐏𝐈 𝐔𝐓𝐈𝐋𝐈𝐒𝐄́𝐄.*`,
      ...channelInfo,
    }, { quoted: message });
  }
}
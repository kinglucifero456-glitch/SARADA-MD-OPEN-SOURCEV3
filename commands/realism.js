import axios from 'axios';
import { channelInfo } from '../lib/messageConfig.js';
import { fakeReacted } from '../lib/freacted.js'
const API_URL = 'https://api.shizo.top/ai/imagine/realism';
const API_KEY = 'shizo'; 

export default async function realismCommand(message, client, { args }) {
  const chatId = message.key.remoteJid;
  const prompt = args.join(' ');

  if (!prompt) {
    return client.sendMessage(chatId, {
      text: '> *❌ 𝐔𝐓𝐈𝐋𝐈𝐒𝐀𝐓𝐈𝐎𝐍 : !realism <description>*',
      ...channelInfo,
    }, { quoted: fakeReacted });
  }

  try {
    await client.sendMessage(chatId, {
      text: '*🎨 𝐆𝐄́𝐍𝐄́𝐑𝐀𝐓𝐈𝐎𝐍 𝐃𝐄 𝐋\'𝐈𝐌𝐀𝐆𝐄 𝐄𝐍 𝐂𝐎𝐔𝐑𝐒...*',
      ...channelInfo,
    }, { quoted: fakeReacted });

    const response = await axios.get(API_URL, {
      params: {
        apikey: API_KEY,
        prompt: prompt,
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
      caption: `> *🧩 𝐈𝐌𝐀𝐆𝐄 𝐆𝐄́𝐍𝐄́𝐑𝐄́𝐄 𝐏𝐎𝐔𝐑 : ${prompt.substring(0, 100)}*`,
      ...channelInfo,
    }, { quoted: fakeReacted });
  } catch (err) {
    console.error('Realism error:', err.message);
    await client.sendMessage(chatId, {
      text: `> ❌ 𝐄𝐑𝐑𝐄𝐔𝐑: ${err.message}\n𝐅𝐀𝐈𝐒 𝐔𝐍𝐄 𝐕𝐄́𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍 𝐒𝐔𝐑 𝐋𝐄 𝐏𝐑𝐎𝐌𝐏𝐓 𝐎𝐔 𝐋'𝐀𝐏𝐈 𝐔𝐓𝐈𝐋𝐈𝐒𝐄́𝐄.`,
      ...channelInfo,
    }, { quoted: fakeReacted });
  }
}
import crypto from 'crypto';
import { channelInfo } from '../lib/messageConfig.js';

const algorithm = 'aes-256-cbc';

const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export default async function jsencryptCommand(message, client, { args }) {
  const chatId = message.key.remoteJid;
  const action = args[0]?.toLowerCase();
  const text = args.slice(1).join(' ');

  if (!action || !text) {
    return client.sendMessage(chatId, {
      text: '> *❌ 𝐔𝐓𝐈𝐋𝐈𝐒𝐀𝐓𝐈𝐎𝐍 : !jsencrypt encrypt <texte> ou !jsencrypt decrypt <hash>*',
      ...channelInfo,
    }, { quoted: message });
  }

  try {
    if (action === 'encrypt') {
      const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const result = iv.toString('hex') + ':' + encrypted;
      await client.sendMessage(chatId, {
        text: `> 🔒 *𝐂𝐇𝐈𝐅𝐅𝐑𝐄́* : \`${result}\``,
        ...channelInfo,
      }, { quoted: message });
    } else if (action === 'decrypt') {
      const [ivHex, encryptedText] = text.split(':');
      const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(ivHex, 'hex'));
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      await client.sendMessage(chatId, {
        text: `> 🔓 *𝐃𝐄𝐂𝐇𝐈𝐅𝐅𝐑𝐄́* : ${decrypted}`,
        ...channelInfo,
      }, { quoted: message });
    } else {
      throw new Error('Action invalide');
    }
  } catch (err) {
    await client.sendMessage(chatId, {
      text: '> *❌ 𝐄𝐑𝐑𝐄𝐔𝐑 𝐋𝐎𝐑𝐒 𝐃𝐙 𝐋\'𝐎𝐏𝐄́𝐑𝐀𝐓𝐈𝐎𝐍*',
      ...channelInfo,
    }, { quoted: message });
  }
}
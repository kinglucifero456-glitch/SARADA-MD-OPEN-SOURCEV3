import axios from "axios";
import { channelInfo } from "../lib/messageConfig.js";
import { fakeQuoted } from "../lib/fquoted.js";

export default async function tiktokCommand(message, client, { args }) {
  const url = args[0];

  if (!url) {
    return client.sendMessage(message.key.remoteJid, {
      text: "*❌ 𝐃𝐎𝐍𝐍𝐄 𝐔𝐍 𝐋𝐈𝐄𝐍 𝐓𝐈𝐊𝐓𝐎𝐊 𝐄𝐓 𝐀𝐒𝐒𝐔𝐑𝐄 𝐓𝐎𝐈 𝐐𝐔'𝐈𝐋 𝐄𝐒𝐓 𝐏𝐑𝐎𝐏𝐑𝐄*",
      ...channelInfo
    },
    { quoted: fakeQuoted });
  }

  try {
    const api = await axios.get(`https://tikwm.com/api/?url=${url}`);
    const data = api.data.data;

    await client.sendMessage(message.key.remoteJid, {
      video: { url: data.play },
      caption: "> 𝙎𝘼𝙍𝘼𝘿𝘼 𝙈𝘿 𝙏𝙄𝙆𝙏𝙊𝙆 𝙈𝙀𝘿𝙄𝘼 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙀𝙍",
      ...channelInfo
    },
    { quoted: fakeQuoted });

  } catch {
    client.sendMessage(message.key.remoteJid, {
      text: "> *❌ Erreur téléchargement, Assure toi que le lien est valide ou Réessaie plutard*",
      ...channelInfo
    },
    { quoted: fakeQuoted });
  }
}
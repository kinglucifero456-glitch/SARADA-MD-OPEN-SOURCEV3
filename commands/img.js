import { channelInfo } from "../lib/messageConfig.js";
import { fakeQuoted } from "../lib/fquoted.js";

import axios from "axios";

export default async function img(message, client, { args }) {
  const chat = message.key.remoteJid;
  const query = args.join(" ");

  if (!query) {
    return client.sendMessage(chat, {
      text: "> *❌ 𝐄𝐗𝐄𝐌𝐏𝐋𝐄: !img naruto*",
      ...channelInfo
    },
    { quoted: fakeQuoted });
  }

  try {
    await client.sendMessage(chat, {
      text: `*_🔎 𝐑𝐄𝐂𝐇𝐄𝐑𝐂𝐇𝐄 𝐃'𝐈𝐌𝐀𝐆𝐄𝐒: ${query}..._*`,
      ...channelInfo
    },
    { quoted: fakeQuoted });

    const api = `https://christus-api.vercel.app/image/Pinterest?query=${encodeURIComponent(query)}&limit=5`;

    const res = await axios.get(api);

    if (!res.data?.results?.length) {
      return client.sendMessage(chat, {
        text: "*_❌ 𝐀𝐔𝐂𝐔𝐍 𝐑𝐄𝐒𝐔𝐋𝐓𝐀𝐓_*",
      ...channelInfo
      },
    { quoted: fakeQuoted });
    }

    for (const img of res.data.results.slice(0, 5)) {
      if (!img.imageUrl) continue;

      await client.sendMessage(chat, {
        image: { url: img.imageUrl },
        caption: `> *📷 𝐈𝐌𝐀𝐆𝐄 𝐏𝐎𝐔𝐑 : ${query}*`,
        ...channelInfo
      },
    { quoted: fakeQuoted });

      await new Promise(r => setTimeout(r, 800));
    }

  } catch (e) {
    console.error(e);
    client.sendMessage(chat, {
      text: "*❌ 𝐄𝐑𝐑𝐄𝐔𝐑 𝐀𝐏𝐈 𝐈𝐌𝐀𝐆𝐄*",
      ...channelInfo
    },
    { quoted: fakeQuoted });
  }
}
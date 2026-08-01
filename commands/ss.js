import fetch from "node-fetch";
import { channelInfo } from "../lib/messageConfig.js";
import { fakeQuoted } from "../lib/fquoted.js";

export default async function ssCommand(message, client, { args }) {
  const chat = message.key.remoteJid;

  if (!args[0]) {
    return client.sendMessage(chat, {
      text: "> *❌ 𝐄𝐗𝐄𝐌𝐏𝐋𝐄: .ss https://google.com*",
      ...channelInfo
    },
    { quoted: fakeReacted });
  }

  try {
    const url = args[0];

    const res = await fetch(`https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}`);
    const buffer = await res.buffer();

    await client.sendMessage(chat, {
      image: buffer,
      ...channelInfo
    },
    { quoted: fakeReacted });

  } catch (e) {
    console.error(e);
  }
}
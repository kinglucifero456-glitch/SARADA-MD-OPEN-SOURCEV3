import axios from "axios";
import { channelInfo } from "../lib/messageConfig.js";
import { fakeProduct } from "../lib/fproduct.js";

export default async function imagineCommand(message, client, { args }) {
  const chat = message.key.remoteJid;

  try {
    if (!args.length) {
      return client.sendMessage(chat, {
        text: "> *❌ 𝐄𝐗𝐄𝐌𝐏𝐋𝐄: .imagine dragon fire*",
        ...channelInfo
      },
    { quoted: fakeProduct });
    }

    const prompt = args.join(" ");

    await client.sendMessage(chat, {
      text: "*🎨 𝐆𝐄́𝐍𝐄́𝐑𝐀𝐓𝐈𝐎𝐍 𝐄𝐍 𝐂𝐎𝐔𝐑𝐒...*",
      ...channelInfo
    },
    { quoted: fakeProduct });

    const res = await axios.get(
      `https://shizoapi.onrender.com/api/ai/gen-imagine`,
      {
        params: {
          apikey: "shizo",
          query: prompt
        },
        responseType: "arraybuffer",
        timeout: 20000
      }
    );

    await client.sendMessage(chat, {
      image: Buffer.from(res.data),
      caption: `> *🎨 𝐏𝐑𝐎𝐌𝐏𝐓: ${prompt}*`,
      ...channelInfo
    },
    { quoted: fakeProduct });

  } catch (e) {
    console.error("imagine error:", e);
    await client.sendMessage(chat, {
      text: "> *❌ 𝐀𝐏𝐈 𝐃𝐎𝐖𝐍*.",
      ...channelInfo
    },
    { quoted: fakeProduct });
  }
}
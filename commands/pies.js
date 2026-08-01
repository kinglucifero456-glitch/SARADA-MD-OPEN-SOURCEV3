import { channelInfo } from "../lib/messageConfig.js";
import { fakeReacted } from "../lib/freacted.js";
import fetch from "node-fetch";

const countries = ["india", "malaysia", "japan", "korea"];

export default async function piesCommand(message, client, { args }) {
  const chat = message.key.remoteJid;

  
  if (!args[0] || !countries.includes(args[0].toLowerCase())) {
    return client.sendMessage(chat, {
      text: `> *❌ 𝐏𝐀𝐘𝐒 𝐈𝐍𝐕𝐀𝐋𝐈𝐃𝐄 𝐎𝐔 𝐌𝐀𝐍𝐒𝐔𝐀𝐍𝐓. 𝐂𝐇𝐎𝐈𝐒𝐈𝐒 𝐏𝐀𝐑𝐌𝐈𝐒 : ${countries.join(", ")}*`,
      ...channelInfo
    },
    { quoted: fakeReacted });
  }

  const country = args[0].toLowerCase();

  try {
    
    const res = await fetch(`https://api.shizo.top/pies/${country}?apikey=shizo`);

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const buffer = await res.arrayBuffer(); 
    const imageBuffer = Buffer.from(buffer);

    
    await client.sendMessage(chat, {
      image: imageBuffer,
      caption: `> *🍑 𝗔 𝗣𝗜𝗘 𝗙𝗢𝗥 \`${country}\` !*`,
      ...channelInfo
    },
    { quoted: fakeReacted });

  } catch (err) {
    console.error("❌ piesCommand error:", err);
    await client.sendMessage(chat, {
      text: "> *❌ 𝐈𝐌𝐏𝐎𝐒𝐒𝐈𝐁𝐋𝐄 𝐃𝐄 𝐑𝐄́𝐂𝐔𝐏𝐄́𝐑𝐄𝐑 𝐋'𝐈𝐌𝐀𝐆𝐄 𝐏𝐎𝐔𝐑 𝐋𝐄 𝐌𝐎𝐌𝐄𝐍𝐓, 𝐑𝐄́𝐄𝐒𝐒𝐀𝐈𝐄 𝐏𝐋𝐔𝐒 𝐓𝐀𝐑𝐃*",
      ...channelInfo
    },
    { quoted: fakeReacted });
  }
}
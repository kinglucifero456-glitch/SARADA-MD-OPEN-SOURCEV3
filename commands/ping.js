import { fakeQuoted } from "../lib/fquoted.js";
import { channelInfo } from "../lib/messageConfig.js";
import { db } from "../lib/db.js"; 

const videos = [
  "https://files.catbox.moe/grjxo4.mp4",
  "https://files.catbox.moe/9f89z9.mp4",
  "https://files.catbox.moe/9099f8.mp4",
  "https://files.catbox.moe/im1h9o.mp4",
  "https://files.catbox.moe/suv9ii.mp4",
  "https://files.catbox.moe/z46942.mp4",
  "https://files.catbox.moe/qdoysm.mp4",
  "https://files.catbox.moe/1q1e61.mp4",
  "https://files.catbox.moe/xgql5q.mp4",
  "https://files.catbox.moe/5coexz.mp4",
  "https://files.catbox.moe/kdcf9u.mp4"
];

export default async function pingCommand(message, client, { config }) {
  const start = Date.now();
  await client.sendPresenceUpdate("composing", message.key.remoteJid);
  const latency = Date.now() - start;

  const text = `*🇭🇰⃟🇦🇱 𝗣𝗜𝗡𝗚 𝗥𝗘𝗣𝗢𝗥𝗧 🇭🇰⃟🇦🇱*
> 𓊈🌹𓊉ᒪᗩTᗴᑎᑕY : ${latency}ms
> 𓊈🌹𓊉ՏTᗩTᑌTՏ : *ONLINE AND RUNNING*
> 𓊈🌹𓊉ᗷOT ᗰOᗪᗴ : *${db.getMode()}*
> 𓊈🌹𓊉ᗷOT ᑭᖇᗴᖴI᙭ : *${db.getPrefix()}*
> 𓊈🌹𓊉ᐯᗴᖇՏIOᑎ : *${config.botVersion}*
> 𓊈🌹𓊉ᑭᒪᗩTᖴOᖇᗰ : *linux*
> 𓊈🌹𓊉ᖴᖇᗴᗴ ᗷOT : *t.me/sarada_md*
${config.addReply}`;

  const randomVideo = videos[Math.floor(Math.random() * videos.length)];

  try {
    await client.sendMessage(
      message.key.remoteJid,
      {
        video: { url: randomVideo },
        caption: text,
        ...channelInfo
      },
      {
        quoted: fakeQuoted
      }
    );
  } catch (err) {
    console.error(err);

    await client.sendMessage(
      message.key.remoteJid,
      {
        text,
        ...channelInfo
      },
      {
        quoted: fakeQuoted
      }
    );
  }
}
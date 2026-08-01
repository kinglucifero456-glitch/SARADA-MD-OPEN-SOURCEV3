import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fakeQuoted } from "../lib/fquoted.js";
import { channelInfo } from "../lib/messageConfig.js";
import { db } from "../lib/db.js"; 

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagePath = path.join(__dirname, "../SlimeMedia/sarada.jpg");

export default async function uptime(message, client, { config }) {
  const chat = message.key.remoteJid;
  const up = process.uptime();
  const d = Math.floor(up / 86400);
  const h = Math.floor((up % 86400) / 3600);
  const m = Math.floor((up % 3600) / 60);
  const s = Math.floor(up % 60);
  const caption = `
╭━━❑ \`SARADA MD UPTIME\`
┣❍ *BOT PREFIX:* ${db.getPrefix()}
┣❍ *UPTIME:*: *${d}j ${h}h ${m}m ${s}s*
┣❍ *RAM:* *${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB*
┣❍ *BOT VERSION:* *${config.botVersion}*
┣❍ *BOT MODE:* *${db.getMode()}*
╰━━━➣ 𝗨𝘀𝗲 ${db.getPrefix()}𝗳𝗿𝗲𝗲𝗯𝗼𝘁 𝗳𝗼𝗿 𝘁𝗮𝗸𝗲 𝗯𝗼𝘁
> 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 𝗧𝗵𝗲 𝗦𝗹𝗶𝗺𝗲 𝗧𝗲𝗰𝗵 𝗘𝗺𝗽𝗶𝗿𝗲
  `;
  
  let imageBuffer;
  try {
    imageBuffer = fs.readFileSync(imagePath);
  } catch {
    imageBuffer = null;
  }
  if (imageBuffer) {
    await client.sendMessage(chat, { image: imageBuffer, caption, ...channelInfo }, { quoted: fakeQuoted });
  } else {
    await client.sendMessage(chat, { text: caption, ...channelInfo }, { quoted: fakeQuoted });
  }
}

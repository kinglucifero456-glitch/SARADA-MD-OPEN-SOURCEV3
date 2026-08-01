import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "../lib/db.js"; 
import { fakeQuoted } from "../lib/fquoted.js";
import { channelInfo } from "../lib/messageConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagePath = path.join(__dirname, "../SlimeMedia/bot.jpg");

export default async function freebotCommand(message, client, { config }) {
  const freebotText = `*🇭🇰⃟🇦🇱𝐒𝐀𝐑𝐀𝐃𝐀 𝐌𝐃🇭🇰⃟🇦🇱*\n
❲☐❳╭───────────────⚯
╭─┼═══════════════⚯
│⎋│𝗩𝗘𝗥𝗦𝗜𝗢𝗡: ${config.botVersion}
│⎋│𝗢𝗪𝗡𝗘𝗥: 𝐒.𝐓.𝐄𝐌𝐏𝐈𝐑𝐄
│⎋│𝗣𝗥𝗘𝗙𝗜𝗫: all prefix's
╰─┴───────────────⚯
┏━━━━━━━━━━━━━━━━━⚯
┃❏ \`𝗕𝗢𝗧 : 𝗦𝗔𝗥𝗔𝗗𝗔 𝗠𝗗\`
┗━━━━━━━━━━━━━━━━━⚯
> 𝗖𝗼𝗺𝗺𝗲𝗻𝘁 𝗱𝗲́𝗽𝗹𝗼𝘆𝗲𝗿 ??
⟬➊⟭ 𝗧𝗼𝘂𝘁 𝗱'𝗮𝗯𝗼𝗿𝗱, 𝘁𝗲́𝗹𝗲́𝗰𝗵𝗮𝗿𝗴𝗲 𝗹𝗲 𝗳𝗶𝗰𝗵𝗶𝗲𝗿 𝘇𝗶𝗽 𝘀𝘂𝗿 𝗴𝗶𝘁𝗵𝘂𝗯
𝗟𝗶𝗲𝗻: ${config.github}
⟬➋⟭ 𝗖𝗿𝗲́𝗲𝗿 𝘂𝗻 𝗰𝗼𝗺𝗽𝘁𝗲 𝘀𝘂𝗿 𝘂𝗻 𝗵𝗼𝘀𝘁𝗶𝗻𝗴 𝗽𝗮𝗻𝗲𝗹/𝘀𝗲𝗿𝘃𝗲𝘂𝗿, 𝗻𝗼𝘂𝘀 𝘂𝘁𝗶𝗹𝗶𝘀𝗼𝗻𝘀 𝗴𝗲́𝗻𝗲́𝗿𝗮𝗹𝗲𝗺𝗲𝗻𝘁: freegamehost.xyz | bot-hosting.net | ecloudserv.fr | lunes.host | panel.fps.ms ; 𝗰𝗵𝗼𝗶𝘀𝗶𝘀 𝗲𝗻 𝘂𝗻
⟬➌⟭ 𝗣𝘂𝗶𝘀 𝗿𝗲𝗻𝗱𝘀-𝘁𝗼𝗶 𝗮̀ 𝗹𝗮 𝘀𝗲𝗰𝘁𝗶𝗼𝗻 "𝗰𝗿𝗲𝗮𝘁𝗲/𝗱𝗲𝗽𝗹𝗼𝘆", 𝗱𝗼𝗻𝗻𝗲 𝘂𝗻 𝗻𝗼𝗺, 𝗮𝘁𝘁𝗲𝗻𝗱𝘀 𝗾𝘂𝗲 𝗹𝗲𝘀 𝗰𝗼𝗻𝗳𝗶𝗴𝘂𝗿𝗮𝘁𝗶𝗼𝗻𝘀 𝘀𝗼𝗶𝗲𝗻𝘁 𝗮𝗰𝗵𝗲́𝘃𝗲́𝗲𝘀
⟬➍⟭ 𝗔𝗽𝗿𝗲̀𝘀 𝗮𝘃𝗼𝗶𝗿 𝗰𝗿𝗲́𝗲𝗿 𝘁𝗼𝗻 𝘀𝗲𝗿𝘃𝗲𝘂𝗿, 𝘃𝗮𝘀 𝘀𝘂𝗿 "𝗳𝗶𝗹𝗲 𝘂𝗽𝗹𝗼𝗮𝗱" 𝗽𝘂𝗶𝘀 𝘁𝗲́𝗹𝗲́𝘃𝗲𝗿𝘀𝗲 𝗹𝗲 𝗳𝗶𝗰𝗵𝗶𝗲𝗿 𝘇𝗶𝗽
⟬➎⟭ 𝗗𝗲́𝗰𝗼𝗺𝗽𝗿𝗲𝘀𝘀𝗲/𝘂𝗻𝗮𝗿𝗰𝗵𝗶𝘃𝗲 𝗹𝗲 𝗳𝗶𝗰𝗵𝗶𝗲𝗿 𝘇𝗶𝗽
⟬➏⟭ 𝗥𝗲𝘁𝗼𝘂𝗿𝗻𝗲 𝗮̀ 𝗹𝗮 𝗰𝗼𝗻𝘀𝗼𝗹𝗲, 𝗽𝘂𝗶𝘀 𝗮𝗽𝗽𝘂𝗶𝗲 𝘀𝘂𝗿 "𝗦𝘁𝗮𝗿𝘁"
⟬➐⟭ 𝗣𝗮𝘁𝗶𝗲𝗻𝘁𝗲 𝗲𝗻𝘃𝗶𝗿𝗼𝗻 1 𝗺𝗶𝗻𝘂𝘁𝗲 𝗼𝘂 𝗺𝗼𝗶𝗻𝘀, 𝗷𝘂𝘀𝗾𝘂'𝗮̀ 𝘃𝗼𝗶𝗿 "𝘀𝘂𝗶𝘃𝗶𝗲 𝗱𝗲 𝗹𝗮 𝗻𝗲𝘄𝘀𝗹𝗲𝘁𝘁𝗲𝗿" (𝘀𝗲𝗹𝗼𝗻 𝘁𝗼𝗻 𝗵𝗲𝗯𝗲𝗿𝗴𝗲𝘂𝗿) 𝗼𝘂 "𝗘𝗻𝘁𝗿𝗲 𝘁𝗼𝗻 𝗻𝘂𝗺𝗲𝗿𝗼" (𝗦𝗶 𝘁𝘂 𝗮𝘀 𝘂𝗻 𝘁𝗿𝗲̀𝘀 𝗯𝗼𝗻 𝗵𝗲𝗯𝗲𝗿𝗴𝗲𝘂𝗿)
⟬➑⟭ 𝗘𝗻𝘁𝗿𝗲 𝘁𝗼𝗻 𝗻𝘂𝗺𝗲𝗿𝗼 𝘄𝗵𝗮𝘁𝘀𝗮𝗽𝗽 𝗮𝘃𝗲𝗰 𝗹'𝗶𝗻𝗱𝗶𝗰𝗮𝘁𝗶𝗳 𝗱𝘂 𝗽𝗮𝘆𝘀 (+223, +225, +226, 𝗲𝘁𝗰), 𝗲𝘁 𝘀𝗮𝗻𝘀 𝗹𝗲 "+"; 𝗮𝘀𝘀𝘂𝗿𝗲 𝘁𝗼𝗶 𝗾𝘂𝗲 𝗹𝗲 𝗻𝘂𝗺𝗲́𝗿𝗼 𝗲𝘀𝘁 𝗰𝗼𝗿𝗿𝗲𝗰𝘁𝗲
⟬➒⟭ 𝗧𝘂 𝗿𝗲𝗰𝗲𝘃𝗿𝗮𝘀 𝘂𝗻 𝗰𝗼𝗱𝗲 𝗱𝗲 𝗰𝗼𝗻𝗻𝗲𝗰𝘁𝗶𝗼𝗻, 𝗮𝗷𝗼𝘂𝘁𝗲𝘀 𝗹𝗲 𝗱𝗮𝗻𝘀 "𝘄𝗵𝗮𝘁𝘀𝗮𝗽𝗽> 𝗔𝗽𝗽𝗮𝗿𝗲𝗶𝗹𝘀 𝗹𝗶𝗲́𝘀> 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗿 𝘂𝗻 𝗮𝗽𝗽𝗮𝗿𝗲𝗶𝗹> 𝗨𝘁𝗶𝗹𝗶𝘀𝗲𝗿 𝘂𝗻 𝗰𝗼𝗱𝗲> 𝗦𝗮𝗶𝘀𝗶𝗿 𝗹𝗲 𝗰𝗼𝗱𝗲" (𝗟𝗲 𝗰𝗼𝗱𝗲 𝗱𝗼𝗶𝘁 𝗲̂𝘁𝗿𝗲 𝘀𝗮𝗻𝘀 𝗳𝗮𝘂𝘁𝗲)
⟬➓⟭ 𝗣𝗮𝘁𝗶𝗲𝗻𝘁𝗲 𝗷𝘂𝘀𝗾𝘂'𝗮̀ 𝗿𝗲́𝗰𝗲́𝘃𝗼𝗶𝗿 𝗹𝗲 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗱𝗲 𝗰𝗼𝗻𝗳𝗶𝗿𝗺𝗮𝘁𝗶𝗼𝗻
> 𝗠𝗶𝗲𝘂𝘅, 𝘃𝗶𝘀𝗶𝗼𝗻𝗻𝗲𝘀 𝗹𝗲 𝘁𝘂𝘁𝗼𝗿𝗶𝗲𝗹 𝘆𝗼𝘂𝘁𝘂𝗯𝗲
𝗟𝗶𝗲𝗻: ${config.youtubeTuto}\n${config.addReply}`;
  let imageBuffer;
  try { imageBuffer = fs.readFileSync(imagePath); } catch { imageBuffer = null; }
  if (imageBuffer) await client.sendMessage(message.key.remoteJid, { image: imageBuffer, caption: freebotText, ...channelInfo }, { quoted: fakeQuoted });
  else await client.sendMessage(message.key.remoteJid, { text: freebotText, ...channelInfo }, { quoted: fakeQuoted });
}
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "../lib/db.js"; 
import { fakeQuoted } from "../lib/fquoted.js";
import { channelInfo } from "../lib/messageConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagePath = path.join(__dirname, "../SlimeMedia/sarada.jpg");

export default async function aliveCommand(message, client, { config }) {
  const aliveText = `*🇭🇰⃟🇦🇱 𝐀𝐋𝐈𝐕𝐄 𝐑𝐄𝐏𝐎𝐑𝐓 🇭🇰⃟🇦🇱*
┏━━━━━━━━━━━━━━━━━━━━⚯
┃❏ \`𝗕𝗢𝗧 : 𝗦𝗔𝗥𝗔𝗗𝗔 𝗠𝗗\`
┗━━━━━━━━━━━━━━━━━━━━⚯
┃❏ \`𝗩𝗘𝗥𝗦𝗜𝗢𝗡 : ${config.botVersion}\`
┃❏ \`𝗦𝗧𝗔𝗧𝗨𝗧 : 𝗢𝗡𝗟𝗜𝗡𝗘\`
┃❏ \`𝗠𝗢𝗗𝗘 : ${db.getMode()}\`
┃❏ \`𝗢𝗪𝗡𝗘𝗥 : 𝐒.𝐓.𝐄𝐌𝐏𝐈𝐑𝐄\`
┃❏ \`𝗣𝗥𝗘𝗙𝗜𝗫 : ${db.getPrefix()}\`
┗━━━━━━━━━━━━━━━━━━━━➢
${config.addReply}`;
  let imageBuffer;
  try { imageBuffer = fs.readFileSync(imagePath); } catch { imageBuffer = null; }
  if (imageBuffer) await client.sendMessage(message.key.remoteJid, { image: imageBuffer, caption: aliveText, ...channelInfo }, { quoted: fakeQuoted });
  else await client.sendMessage(message.key.remoteJid, { text: aliveText, ...channelInfo }, { quoted: fakeQuoted });
}
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "../lib/db.js"; 
import { fakeQuoted } from "../lib/fquoted.js";
import { channelInfo } from "../lib/messageConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commandsPath = path.join(__dirname, "../commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

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

export default async function menuCommand(message, client, { config }) {
  const chat = message.key.remoteJid;

  let menuText = `╭━━❑ *${config.BotName}* ❑━━⚯\n`;
  menuText += `┃𓊈🩸𓊉 *𝐏𝐑𝐄𝐅𝐈𝐗* : \`${db.getPrefix()}\`\n`;
  menuText += `┃𓊈🩸𓊉 *𝐌𝐎𝐃𝐄* : ${db.getMode()}\n`;
  menuText += `┃𓊈🩸𓊉 *𝐎𝐖𝐍𝐄𝐑* : ${config.ownerNumber}\n`;
  menuText += `┃𓊈🩸𓊉 *𝐕𝐄𝐑𝐒𝐈𝐎𝐍* : *3.3*\n`;
  menuText += `┃𓊈🩸𓊉 *𝐂𝐌𝐃𝐒* : ${commandFiles.length}\n`;
  menuText += `╰━━━━━━━━━━━━━━━⚯\n\n`;

  menuText += `╭─❑ *COMMANDES* ❑─⚯\n`;
  for (const file of commandFiles) {
    const name = file.replace(".js", "");
    menuText += `┃⎋❯❯ \`${db.getPrefix()}${name}\`\n`;
  }
  menuText += `╰━━━━━━━━━━━━━━━⚯\n𝗨𝘀𝗲 \`𝗳𝗿𝗲𝗲𝗯𝗼𝘁\` 𝗳𝗼𝗿 𝘁𝘂𝘁𝗼 𝗮𝗻𝗱 \`𝗺𝗲𝗻𝘂2\` 𝗳𝗼𝗿 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝗰𝗮𝘁𝗲́𝗴𝗼𝗿𝗶𝗲𝘀\n${config.addReply}`;

  const randomVideo = videos[Math.floor(Math.random() * videos.length)];

  try {
    await client.sendMessage(
      chat,
      {
        video: { url: randomVideo },
        caption: menuText,
        ...channelInfo
      },
      {
        quoted: fakeQuoted
      }
    );
  } catch (err) {
    console.error(err);

    await client.sendMessage(
      chat,
      {
        text: menuText,
        ...channelInfo
      },
      {
        quoted: fakeQuoted
      }
    );
  }
}
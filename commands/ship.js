import { channelInfo } from "../lib/messageConfig.js";
import { buildCascadeQuoted } from "../lib/cascade.js";
const quotedCascade = buildCascadeQuoted(
  "𝐒𝐀𝐑𝐀𝐃𝐀 𝐌𝐃 𝐕3 !", 
  "🌹 𝗦𝗛𝗜𝗣 𝗥𝗘𝗣𝗢𝗥𝗧 🌹"
);

export default async function shipCommand(message, client) {
  const chat = message.key.remoteJid;

  try {
    const meta = await client.groupMetadata(chat);
    const users = meta.participants.map(p => p.id);

    const a = users[Math.floor(Math.random() * users.length)];
    let b;

    do {
      b = users[Math.floor(Math.random() * users.length)];
    } while (b === a);

    await client.sendMessage(chat, {
      text: `┌─────────────▣\n│ 🇭🇰⃟🇦🇱𝙎𝙃𝙄𝙋 𝙍𝙀𝙋𝙊𝙍𝙏\n└─────────────▣\n\n🇺 🇸 🇪 🇷 💘 @${a.split("@")[0]} 🅛🅞🅥🅔 🇺 🇸 🇪 🇷 ❤️ @${b.split("@")[0]}`,
      mentions: [a, b],
      ...channelInfo
    },
  { quoted: quotedCascade } );

  } catch (e) {
    console.error(e);
  }
}
import { channelInfo } from "../lib/messageConfig.js";
import { fakeProduct } from "../lib/fproduct.js";

export default async function hidetagCommand(message, client) {
  try {
    const remoteJid = message.key.remoteJid;

    
    const metadata = await client.groupMetadata(remoteJid).catch(() => null);
    if (!metadata) return client.sendMessage(remoteJid, { text: "> *❌ Cette commande ne fonctionne que dans un groupe.*",
      ...channelInfo },
      { quoted: fakeProduct });

    const participants = metadata.participants.map(p => p.id);
    const text = message.message?.conversation?.split(" ").slice(1).join(" ")
      || message.message?.extendedTextMessage?.text?.split(" ").slice(1).join(" ")
      || message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation
      || "╔══════════════════⏣\n┃߷ *_𝙃𝙀𝙇𝙇𝙊 𝙀𝙑𝙀𝙍𝙔𝙊𝙉𝙀_* 👋\n╚══════════════════⏣\n\n> 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐓𝐇𝐄 𝐒𝐋𝐈𝐌𝐄 𝐓𝐄𝐂𝐇 𝐄𝐌𝐏𝐈𝐑𝐄";

    await client.sendMessage(remoteJid, {
      text,
      mentions: participants
    },
    { quoted: fakeProduct });

  } catch (err) {
    console.error("Erreur dans tagCommand:", err);
    await client.sendMessage(message.key.remoteJid, { text: "*⚠️ Erreur lors du tag.*",
              ...channelInfo },
    { quoted: fakeProduct });
  }
}
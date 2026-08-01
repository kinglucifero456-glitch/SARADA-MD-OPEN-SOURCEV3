import { channelInfo } from "../lib/messageConfig.js";
import { fakeQuoted } from "../lib/fquoted.js";

export default async function tagallCommand(message, client, { config }) {
  try {
    const remoteJid = message.key.remoteJid;

    const metadata = await client.groupMetadata(remoteJid).catch(() => null);
    if (!metadata) {
      return client.sendMessage(remoteJid, {
        text: "> *❌ 𝐂𝐄𝐓𝐓𝐄 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐄 𝐍𝐄 𝐅𝐎𝐍𝐂𝐓𝐈𝐎𝐍𝐍𝐄 𝐐𝐔𝐄 𝐃𝐀𝐍𝐒 𝐔𝐍 𝐆𝐑𝐎𝐔𝐏𝐄.*",
        ...channelInfo,
      }, { quoted: fakeQuoted });
    }

    const sender = message.key.participant || message.key.remoteJid;
    const ppUrl = await client.profilePictureUrl(sender, "image")
      .catch(() => "https://files.catbox.moe/jgpoov.jpg");

    const memberBlocks = metadata.participants.map(p => {
      const username = p.id.split("@")[0];
      return `┏━━━━━━━━━━━━⎆
┣❏ ༕@${username}
┗━━━⎆`;
    }).join("\n");

    const caption = `\`⊶━🇭🇰⃟🇦🇱Tᗩᘎᗩᒪᒪ🇭🇰⃟🇦🇱━⊷\`
${memberBlocks}

*_💠YOU ARE ALL WANTED HERE💠_*

> 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐓𝐇𝐄 𝐒𝐋𝐈𝐌𝐄 𝐓𝐄𝐂𝐇 𝐄𝐌𝐏𝐈𝐑𝐄`;

    await client.sendMessage(remoteJid, {
      image: { url: ppUrl },
      caption: caption,
      mentions: metadata.participants.map(p => p.id), 
      ...channelInfo,
    }, { quoted: fakeQuoted });

  } catch (err) {
    console.error("Erreur tagall:", err);
    await client.sendMessage(message.key.remoteJid, {
      text: "> ⚠️ 𝐄𝐑𝐑𝐄𝐔𝐑 𝐋𝐎𝐑𝐒 𝐃𝐔 𝐓𝐀𝐆𝐀𝐋𝐋.",
      ...channelInfo,
    }, { quoted: fakeQuoted });
  }
}
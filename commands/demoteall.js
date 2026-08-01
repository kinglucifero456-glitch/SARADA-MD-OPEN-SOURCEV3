import { checkAdminPermission } from "../lib/adminUtils.js";
import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";

export default async function demoteallCommand(message, client) {
  const chat = message.key.remoteJid;
  if (!chat.endsWith("@g.us")) return client.sendMessage(chat, { text: "> _*❌ 𝘾𝙤𝙢𝙢𝙖𝙣𝙙𝙚 𝙙𝙚 𝙂𝙧𝙤𝙪𝙥𝙚 𝙪𝙣𝙞𝙦𝙪𝙚𝙢𝙚𝙣𝙩*_", ...channelInfo }, { quoted: fakeQuoted });

  try {
    await checkAdminPermission(client, message, chat);
    const groupMetadata = await client.groupMetadata(chat);
    const botJid = client.user.id.split(':')[0] + "@s.whatsapp.net";
    
    const adminsToDemote = groupMetadata.participants
      .filter(p => p.admin && p.id !== botJid && p.admin !== "superadmin")
      .map(p => p.id);

    if (adminsToDemote.length === 0) {
      return client.sendMessage(chat, { text: "> *_ℹ️ 𝐀𝐔𝐂𝐔𝐍 𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐓𝐄𝐔𝐑 𝐃𝐄𝐒𝐓𝐈𝐓𝐔𝐀𝐁𝐋𝐄 𝐓𝐑𝐎𝐔𝐕𝐄́._*", ...channelInfo }, { quoted: fakeQuoted });
    }

    await client.sendMessage(chat, { text: `*_🪀Destitutions en masse..._*\n> *𝐍𝐨𝐦𝐛𝐫𝐞: ${adminsToDemote.length} admins*`, ...channelInfo }, { quoted: fakeQuoted });
    await client.groupParticipantsUpdate(chat, adminsToDemote, "demote");
    return client.sendMessage(chat, { text: "*_📉 𝐓𝐎𝐔𝐒 𝐋𝐄𝐒 𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐓𝐄𝐔𝐑𝐒 𝐎𝐍𝐓 𝐄́𝐓𝐄́ 𝐃𝐄́𝐒𝐓𝐈𝐓𝐔𝐄́𝐒 !_*", ...channelInfo }, { quoted: fakeQuoted });
  } catch (err) {
    return client.sendMessage(chat, { text: `> *_❌ Erreur : ${err.message || err}_*`, ...channelInfo }, { quoted: fakeQuoted });
  }
}

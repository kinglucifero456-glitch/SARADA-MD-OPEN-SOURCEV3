import { checkAdminPermission } from "../lib/adminUtils.js";
import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";

export default async function promoteallCommand(message, client) {
  const chat = message.key.remoteJid;
  if (!chat.endsWith("@g.us")) return client.sendMessage(chat, { text: "> ❌ 𝐆𝐑𝐎𝐔𝐏𝐄 𝐔𝐍𝐈𝐐𝐔𝐄𝐌𝐄𝐍𝐓.", ...channelInfo }, { quoted: fakeQuoted });

  try {
    await checkAdminPermission(client, message, chat);
    const groupMetadata = await client.groupMetadata(chat);
    const nonAdmins = groupMetadata.participants.filter(p => !p.admin).map(p => p.id);

    if (nonAdmins.length === 0) {
      return client.sendMessage(chat, { text: "> *ℹ️ 𝐓𝐎𝐔𝐒 𝐋𝐄𝐒 𝐌𝐄𝐌𝐁𝐑𝐄𝐒 𝐒𝐎𝐍𝐓 𝐃𝐄́𝐉𝐀̀ 𝐀𝐃𝐌𝐔𝐍𝐈𝐒𝐓𝐑𝐀𝐓𝐄𝐔𝐑𝐒.*", ...channelInfo }, { quoted: fakeQuoted });
    }

    await client.sendMessage(chat, { text: `🪀 *𝐏𝐑𝐎𝐌𝐎𝐓𝐈𝐎𝐍𝐒 𝐄𝐍 𝐌𝐀𝐒𝐒𝐄...*\n> *𝐍𝐨𝐦𝐛𝐫𝐞: ${nonAdmins.length} 𝐦𝐞𝐦𝐛𝐫𝐞𝐬*`, ...channelInfo }, { quoted: fakeQuoted });
    await client.groupParticipantsUpdate(chat, nonAdmins, "promote");
    return client.sendMessage(chat, { text: "*👑 𝐓𝐎𝐔𝐒 𝐋𝐄𝐒 𝐌𝐄𝐌𝐁𝐑𝐄𝐒 𝐄́𝐋𝐈𝐆𝐈𝐁𝐋𝐄𝐒 𝐎𝐍𝐓 𝐄́𝐓𝐄́ 𝐏𝐑𝐎𝐌𝐔𝐒 !*", ...channelInfo }, { quoted: fakeQuoted });
  } catch (err) {
    return client.sendMessage(chat, { text: `> ❌ 𝐄𝐑𝐑𝐄𝐔𝐑 : ${err.message || err}`, ...channelInfo }, { quoted: fakeQuoted });
  }
}

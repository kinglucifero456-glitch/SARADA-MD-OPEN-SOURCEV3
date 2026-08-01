import { checkAdminPermission } from "../lib/adminUtils.js";
import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";

export default async function purge44Command(message, client) {
  const chat = message.key.remoteJid;
  if (!chat.endsWith("@g.us")) return client.sendMessage(chat, { text: "> ❌ 𝐆𝐑𝐎𝐔𝐏𝐄 𝐔𝐍𝐈𝐐𝐔𝐄𝐌𝐄𝐍𝐓.", ...channelInfo }, { quoted: fakeQuoted });

  try {
    await checkAdminPermission(client, message, chat);
    const groupMetadata = await client.groupMetadata(chat);
    const targets = groupMetadata.participants.filter(p => p.id.startsWith("44") && !p.admin).map(p => p.id);

    if (targets.length === 0) {
      return client.sendMessage(chat, { text: "> *🛡️ 𝐀𝐔𝐂𝐔𝐍 𝐌𝐄𝐌𝐁𝐑𝐄 𝐀𝐕𝐄𝐂 𝐋'𝐈𝐍𝐃𝐈𝐂𝐀𝐓𝐈𝐅 +44 𝐓𝐑𝐎𝐔𝐕𝐄́.*", ...channelInfo }, { quoted: fakeQuoted });
    }

    await client.sendMessage(chat, { text: `> 🏰 *𝐍𝐄𝐓𝐓𝐎𝐘𝐀𝐆𝐄...* 𝐄𝐗𝐏𝐔𝐋𝐒𝐈𝐎𝐍 𝐃𝐄 ${targets.length} 𝐂𝐎𝐌𝐏𝐓𝐄𝐒 +44...`, ...channelInfo }, { quoted: fakeQuoted });
    await client.groupParticipantsUpdate(chat, targets, "remove");
    return client.sendMessage(chat, { text: `> *✅ 𝐑𝐀𝐅𝐋𝐄 𝐓𝐄𝐑𝐌𝐈𝐍𝐄́. ${targets.length} 𝐂𝐎𝐌𝐏𝐓𝐄𝐒 𝐎𝐍𝐓 𝐄́𝐓𝐄́ 𝐏𝐔𝐑𝐆𝐄́𝐒 !*`, ...channelInfo }, { quoted: fakeQuoted });
  } catch (err) {
    return client.sendMessage(chat, { text: `> ❌ 𝐄𝐑𝐑𝐄𝐔𝐑 : ${err.message || err}`, ...channelInfo }, { quoted: fakeQuoted });
  }
}

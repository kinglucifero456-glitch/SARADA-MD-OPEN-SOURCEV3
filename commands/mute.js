import { checkAdminPermission } from "../lib/adminUtils.js";
import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";

export default async function muteCommand(message, client) {
  const chat = message.key.remoteJid;
  if (!chat.endsWith("@g.us")) return client.sendMessage(chat, { text: "> *❌ 𝐆𝐑𝐎𝐔𝐏𝐄 𝐔𝐍𝐈𝐐𝐔𝐄𝐌𝐄𝐍𝐓.*", ...channelInfo }, { quoted: fakeQuoted });

  try {
    await checkAdminPermission(client, message, chat);
    await client.groupSettingUpdate(chat, "announcement");
    return client.sendMessage(chat, { text: "> 🔒 *𝐆𝐑𝐎𝐔𝐏𝐄 𝐅𝐄𝐑𝐌𝐄́.* 𝐒𝐄𝐔𝐋𝐒 𝐋𝐄𝐒 𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐓𝐄𝐔𝐑𝐒 𝐏𝐄𝐔𝐕𝐄𝐍𝐓 𝐄𝐍𝐕𝐎𝐘𝐄́ 𝐃𝐄𝐒 𝐌𝐄𝐒𝐒𝐀𝐆𝐄𝐒", ...channelInfo }, { quoted: fakeQuoted });
  } catch (err) {
    return client.sendMessage(chat, { text: `> *❌ 𝐄𝐑𝐑𝐄𝐔𝐑 : ${err.message || err}*`, ...channelInfo }, { quoted: fakeQuoted });
  }
}

import { db } from "../lib/db.js";
import { checkAdminPermission } from "../lib/adminUtils.js";
import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";

export default async function groupmodeCommand(message, client, { args }) {
  const chat = message.key.remoteJid;
  if (!chat.endsWith("@g.us")) return client.sendMessage(chat, { text: "> *❌ 𝐆𝐑𝐎𝐔𝐏𝐄 𝐔𝐍𝐈𝐐𝐔𝐄𝐌𝐄𝐍𝐓.*", ...channelInfo }, { quoted: fakeQuoted });

  try {
    await checkAdminPermission(client, message, chat);
    const value = args[0]?.toLowerCase();
    if (value !== "public" && value !== "admin") {
      return client.sendMessage(chat, { text: "> *⚙️ 𝐔𝐓𝐈𝐋𝐈𝐒𝐀𝐓𝐈𝐎𝐍 :* `.groupmode public` ou `.groupmode admin`", ...channelInfo }, { quoted: fakeQuoted });
    }
    db.updateGroup(chat, "mode", value);
    return client.sendMessage(chat, { text: `> *⚙️ 𝐌𝐎𝐃𝐄 𝐃𝐔 𝐆𝐑𝐎𝐔𝐏𝐄 𝐂𝐎𝐍𝐅𝐈𝐆𝐔𝐑𝐄́ 𝐒𝐔𝐑* : *${value.toUpperCase()}*`, ...channelInfo }, { quoted: fakeQuoted });
  } catch (err) {
    return client.sendMessage(chat, { text: `❌ 𝐄𝐑𝐑𝐄𝐔𝐑 : ${err.message || err}`, ...channelInfo }, { quoted: fakeQuoted });
  }
}

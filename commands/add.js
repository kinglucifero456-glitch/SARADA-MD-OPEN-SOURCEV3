import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";
import { checkAdminPermission, ensureBotAdmin } from "../lib/adminUtils.js";

export default async function addCommand(message, client, { args }) {
  const chat = message.key.remoteJid;
  if (!chat.endsWith("@g.us")) return client.sendMessage(chat, { text: "> ❌ 𝙂𝙍𝙊𝙐𝙋𝙀 𝙐𝙉𝙄𝙌𝙐𝙀𝙈𝙀𝙉𝙏.", ...channelInfo }, { quoted: fakeQuoted });
  try {
    await checkAdminPermission(client, message, chat);
    await ensureBotAdmin(client, chat);
  } catch (err) {
    return client.sendMessage(chat, { text: err.message, ...channelInfo }, { quoted: fakeQuoted });
  }
  const number = args[0]?.replace(/[^0-9]/g, "");
  if (!number) return client.sendMessage(chat, { text: "> _*❌ 𝙐𝙏𝙄𝙇𝙄𝙎𝘼𝙏𝙄𝙊𝙉 : .add 226XXXXXXXX*_", ...channelInfo }, { quoted: fakeQuoted });
  const jid = number + "@s.whatsapp.net";
  try {
    await client.groupParticipantsUpdate(chat, [jid], "add");
    await client.sendMessage(chat, { text: `> _*✅ 𝙉𝙊𝙐𝙑𝙀𝘼𝙐 𝙈𝙀𝙈𝘽𝙍𝙀 𝘼𝙅𝙊𝙐𝙏É: @${number} 𝘽𝙄𝙀𝙉𝙑𝙀𝙉𝙐𝙀*_`, mentions: [jid], ...channelInfo }, { quoted: fakeQuoted });
  } catch (e) {
    await client.sendMessage(chat, { text: `> *_❌ ${e.message}*_`, ...channelInfo }, { quoted: fakeQuoted });
  }
}
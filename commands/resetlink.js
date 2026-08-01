import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";
import { checkAdminPermission, ensureBotAdmin } from "../lib/adminUtils.js";

export default async function resetlinkCommand(message, client) {
  const chat = message.key.remoteJid;
  if (!chat.endsWith("@g.us")) return client.sendMessage(chat, { text: "> *❌ 𝐆𝐑𝐎𝐔𝐏𝐄 𝐔𝐍𝐈𝐐𝐔𝐄𝐌𝐄𝐍𝐓.*", ...channelInfo }, { quoted: fakeQuoted });
  try {
    await checkAdminPermission(client, message, chat);
    await ensureBotAdmin(client, chat);
  } catch (err) {
    return client.sendMessage(chat, { text: err.message, ...channelInfo }, { quoted: fakeQuoted });
  }
  const code = await client.groupRevokeInvite(chat);
  await client.sendMessage(chat, { text: `> 𝐋𝐈𝐄𝐍 𝐃𝐔 𝐆𝐑𝐎𝐔𝐏𝐄 𝐌𝐈𝐒 𝐀̀ 𝐉𝐎𝐔𝐑\n🔗 *𝐍𝐎𝐔𝐕𝐄𝐀𝐔 𝐋𝐈𝐑𝐍 :*\n> https://chat.whatsapp.com/${code}`, ...channelInfo }, { quoted: fakeQuoted });
}
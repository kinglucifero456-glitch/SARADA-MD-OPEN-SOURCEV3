import { db } from "../lib/db.js";
import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";

export default async function setprefixCommand(message, client, { args, isOwner, adminData }) {
  const chat = message.key.remoteJid;
  const isGroup = chat.endsWith("@g.us");

  const hasPermission = message.key.fromMe || isOwner || (isGroup && adminData?.isAdmin);

  if (!hasPermission) {
    return client.sendMessage(chat, { text: "> *❌ 𝐃𝐑𝐎𝐈𝐓𝐒 𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐒𝐀𝐍𝐓𝐒 𝐏𝐎𝐔𝐑 𝐌𝐎𝐃𝐈𝐅𝐈𝐄𝐑 𝐋𝐄 𝐏𝐑𝐄𝐅𝐈𝐗𝐄*", ...channelInfo }, { quoted: fakeQuoted });
  }

  const newPrefix = args[0];
  if (!newPrefix) {
    return client.sendMessage(chat, { text: "> *❌ 𝐕𝐄𝐔𝐈𝐋𝐋𝐄𝐙 𝐒𝐏𝐄́𝐂𝐈𝐅𝐈𝐄𝐑 𝐔𝐍 𝐏𝐑𝐄𝐅𝐈𝐗𝐄 𝐕𝐀𝐋𝐈𝐃𝐄.*\n> *𝐄𝐗𝐄𝐌𝐏𝐋𝐄 :* `.setprefix !`", ...channelInfo }, { quoted: fakeQuoted });
  }

  db.setPrefix(newPrefix);

  return client.sendMessage(chat, { 
    text: `🪀 *𝐂𝐎𝐍𝐅𝐈𝐆𝐔𝐑𝐀𝐓𝐈𝐎𝐍 𝐒𝐘𝐒𝐓𝐄̀𝐌𝐄* : 𝐋𝐄 𝐏𝐑𝐄́𝐅𝐈𝐗𝐄 𝐆𝐋𝐎𝐁𝐀𝐋 𝐀 𝐄́𝐓𝐄́ 𝐂𝐇𝐀𝐍𝐆𝐄́ 𝐏𝐎𝐔𝐑: *${newPrefix}*`, 
    ...channelInfo 
  }, { quoted: fakeQuoted });
}

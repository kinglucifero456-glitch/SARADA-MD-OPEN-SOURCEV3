import { downloadContentFromMessage } from "@whiskeysockets/baileys";
import { isOwner, isSudo } from "../lib/permissions.js";
import { fakeQuoted } from "../lib/fquoted.js";
import { channelInfo } from "../lib/messageConfig.js";

export default async function setppCommand(message, client, { isOwner, isSudo }) {
  const chat = message.key.remoteJid;
  if (!isOwner && !isSudo) return client.sendMessage(chat, { text: "> ❌ 𝐑𝐄́𝐒𝐄̀𝐑𝐕𝐄́ 𝐀̀ 𝐋'𝐎𝐖𝐍𝐄𝐑.", ...channelInfo }, { quoted: fakeQuoted });
  const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (!quoted?.imageMessage) return client.sendMessage(chat, { text: "❌ 𝐑𝐄́𝐏𝐎𝐍𝐃 𝐀̀ 𝐔𝐍𝐄 𝐈𝐌𝐀𝐆𝐄.", ...channelInfo }, { quoted: fakeQuoted });
  const stream = await downloadContentFromMessage(quoted.imageMessage, "image");
  let buffer = Buffer.from([]);
  for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
  await client.updateProfilePicture(client.user.id, buffer);
  await client.sendMessage(chat, { text: "✅ 𝐏𝐇𝐎𝐓𝐎 𝐃𝐄 𝐏𝐑𝐎𝐅𝐈𝐋 𝐌𝐈𝐒𝐄 𝐀̀ 𝐉𝐎𝐔𝐑.", ...channelInfo }, { quoted: fakeQuoted });
}
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { fakeQuoted } from "../lib/fquoted.js";

export default async function cgrouppCommand(message, client, { adminData, isOwner, isSudo, chat }) {
  if (!chat.endsWith("@g.us")) return;

  if (!isOwner && !isSudo && !adminData.isAdmin) {
    return await client.sendMessage(chat, { text: "> *❌ Droits admin requis.*" }, { quoted: fakeQuoted });
  }
  const isImage = message.message?.imageMessage;
  const isQuotedImage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;

  if (!isImage && !isQuotedImage) {
    return await client.sendMessage(chat, { text: "> *⚠️ Veuillez répondre à une image ou en joindre une.*" }, { quoted: message });
  }

  try {
    const targetMessage = isImage ? message : { message: message.message.extendedTextMessage.contextInfo.quotedMessage };
    const buffer = await downloadMediaMessage(targetMessage, "buffer", {});
    
    await client.updateProfilePicture(chat, buffer);
    await client.sendMessage(chat, { text: "> *📸 Photo de profil du groupe mise à jour !*" }, { quoted: message });
  } catch (err) {
    console.error(err);
    await client.sendMessage(chat, { text: "> ❌ Erreur lors du changement de l'image." }, { quoted: message });
  }
}

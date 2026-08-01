import { fakeQuoted } from "../lib/fquoted.js";
import { channelInfo } from "../lib/messageConfig.js";

export default async function cgroupnameCommand(message, client, { args, adminData, isOwner, isSudo, chat }) {
  if (!chat.endsWith("@g.us")) return client.sendMessage(chat, { text: "> *❌ Groupe uniquement.*", ...channelInfo }, { quoted: fakeQuoted });

  if (!isOwner && !isSudo && !adminData.isAdmin) {
    return client.sendMessage(chat, { text: "> *❌ Droits admin requis.*", ...channelInfo }, { quoted: fakeQuoted });
  }

  const newName = args.join(" ");
  if (!newName) {
    return client.sendMessage(chat, { text: "> *⚠️ Veuillez fournir un nouveau nom.*", ...channelInfo }, { quoted: fakeQuoted });
  }

  try {
    await client.groupUpdateSubject(chat, newName);
    return client.sendMessage(chat, { text: `> *✅ Nom du groupe mis à jour :* ${newName}`, ...channelInfo }, { quoted: fakeQuoted });
  } catch (err) {
    return client.sendMessage(chat, { text: `> *❌ Erreur :* ${err.message}`, ...channelInfo }, { quoted: fakeQuoted });
  }
}
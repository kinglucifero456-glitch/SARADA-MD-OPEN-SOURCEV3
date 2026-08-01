import { fakeQuoted } from "../lib/fquoted.js";
import { channelInfo } from "../lib/messageConfig.js";

export default async function cgroupdescCommand(message, client, { args, adminData, isOwner, isSudo, chat }) {
  if (!chat.endsWith("@g.us")) return client.sendMessage(chat, { text: "> *❌ Groupe uniquement.*", ...channelInfo }, { quoted: fakeQuoted });

  if (!isOwner && !isSudo && !adminData.isAdmin) {
    return client.sendMessage(chat, { text: "> *❌ Droits admin requis.*", ...channelInfo }, { quoted: fakeQuoted });
  }

  const newDesc = args.join(" ");
  if (!newDesc) {
    return client.sendMessage(chat, { text: "> *⚠️ Veuillez fournir une nouvelle description.*", ...channelInfo }, { quoted: fakeQuoted });
  }

  try {
    await client.groupUpdateDescription(chat, newDesc);
    return client.sendMessage(chat, { text: `> *✅ Description mise à jour :*\n${newDesc}`, ...channelInfo }, { quoted: fakeQuoted });
  } catch (err) {
    return client.sendMessage(chat, { text: `> *❌ Erreur :* ${err.message}`, ...channelInfo }, { quoted: fakeQuoted });
  }
}
import { fakeQuoted } from "../lib/fquoted.js";
import { channelInfo } from "../lib/messageConfig.js";
import { isOwner } from "../lib/permissions.js";

export default async function unblockCommand(message, client, { args, chat, senderId }) {
  if (!isOwner(senderId)) {
    return client.sendMessage(chat, { text: "> *❌ Commande réservée aux propriétaires.*", ...channelInfo }, { quoted: fakeQuoted });
  }

  let target = args[0];
  if (!target) {
    return client.sendMessage(chat, { text: "> *⚠️ Mentionnez ou donnez le numéro à débloquer.*", ...channelInfo }, { quoted: fakeQuoted });
  }

  const cleaned = target.replace(/[^0-9]/g, "");
  if (cleaned.length < 8) {
    return client.sendMessage(chat, { text: "> *❌ Numéro invalide.*", ...channelInfo }, { quoted: fakeQuoted });
  }
  const jid = cleaned + "@s.whatsapp.net";

  try {
    await client.updateBlockStatus(jid, "unblock");
    return client.sendMessage(chat, { text: `> *✅ Débloqué :* @${cleaned}`, mentions: [jid], ...channelInfo }, { quoted: fakeQuoted });
  } catch (err) {
    return client.sendMessage(chat, { text: `> *❌ Erreur :* ${err.message}`, ...channelInfo }, { quoted: fakeQuoted });
  }
}
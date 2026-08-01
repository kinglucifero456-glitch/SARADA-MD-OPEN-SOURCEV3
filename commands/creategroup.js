import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { fakeQuoted } from "../lib/fquoted.js";
import { channelInfo } from "../lib/messageConfig.js";
import { isOwner } from "../lib/permissions.js";

export default async function creategroupCommand(message, client, { args, chat, senderId }) {
  if (!isOwner(senderId)) {
    return client.sendMessage(chat, { text: "> *❌ Commande réservée aux propriétaires.*", ...channelInfo }, { quoted: fakeQuoted });
  }

  const groupName = args.join(" ");
  if (!groupName) {
    return client.sendMessage(chat, { text: "> *⚠️ Utilisation :* `.creategroup Nom du groupe` (et joindre une image éventuellement)", ...channelInfo }, { quoted: fakeQuoted });
  }

  let imageBuffer = null;
  const msg = message.message;
  const isImage = msg?.imageMessage;
  const isQuotedImage = msg?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
  if (isImage || isQuotedImage) {
    const targetMsg = isImage ? message : { message: msg.extendedTextMessage.contextInfo.quotedMessage };
    imageBuffer = await downloadMediaMessage(targetMsg, "buffer", {});
  }

  try {
    const participants = [senderId];
    const group = await client.groupCreate(groupName, participants);
    const groupJid = group.gid;

    if (imageBuffer) {
      await client.updateProfilePicture(groupJid, imageBuffer);
    }

    const inviteCode = await client.groupInviteCode(groupJid);
    const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

    await client.sendMessage(chat, {
      text: `> *✅ Groupe créé avec succès !*\n\n📛 *Nom :* ${groupName}\n🔗 *Lien :* ${inviteLink}`,
      ...channelInfo
    }, { quoted: fakeQuoted });

    await client.sendMessage(groupJid, {
      text: `👋 Bienvenue dans *${groupName}* !\nLien d'invitation : ${inviteLink}`,
      ...channelInfo
    });

  } catch (err) {
    return client.sendMessage(chat, { text: `> *❌ Erreur :* ${err.message}`, ...channelInfo }, { quoted: fakeQuoted });
  }
}
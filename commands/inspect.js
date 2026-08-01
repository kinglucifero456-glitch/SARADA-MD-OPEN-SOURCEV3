import { channelInfo } from '../lib/messageConfig.js';
import { fakeQuoted } from '../lib/fquoted.js';

export default async function inspectCommand(message, client, { args }) {
  const chat = message.key.remoteJid;
  const inputUrl = args[0];

  if (!inputUrl) {
    return await client.sendMessage(chat, {
      text: "> ❌ *Erreur :* Veuillez fournir un lien de groupe WhatsApp valide.\n> Exemple : `inspect https://chat.whatsapp.com/CodeDuGroupe`",
      ...channelInfo
    }, { quoted: fakeQuoted });
  }

  const groupRegex = /chat\.whatsapp\.com\/([a-zA-Z0-9]{22,24})/;
  const match = inputUrl.match(groupRegex);

  if (!match) {
    return await client.sendMessage(chat, {
      text: "> ❌ *Lien non valide !* Assurez-vous qu'il s'agit d'un lien d'invitation WhatsApp standard.",
      ...channelInfo
    }, { quoted: fakeQuoted });
  }

  const inviteCode = match[1];

  try {
    await client.sendMessage(chat, { text: "> 🔍 *𝐀𝐍𝐀𝐋𝐘𝐒𝐄 𝐄𝐍 𝐂𝐎𝐔𝐑𝐒...*" });

    const groupMetaData = await client.groupGetInviteInfo(inviteCode);

    const creationDate = groupMetaData.creation 
      ? new Date(groupMetaData.creation * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : "Inconnue";
      
    const creator = groupMetaData.owner ? `@${groupMetaData.owner.split('@')[0]}` : "𝙸𝙽𝙲𝙾𝙽𝙽𝚄";
    const size = groupMetaData.size || "Inconnu";
    const status = groupMetaData.restrict ? "🔒 𝙰𝙳𝙼𝙸𝙽𝚂 𝚄𝙽𝙸𝚀𝚄𝙴𝙼𝙴𝙽𝚃" : "🔓 𝙰̀ 𝚃𝙾𝚄𝚂 𝙻𝙴𝚂 𝙼𝙴𝙼𝙱𝚁𝙴𝚂";
    let profilePicUrl;
    try {
      profilePicUrl = await client.profilePictureUrl(groupMetaData.id, 'image');
    } catch {
      profilePicUrl = "https://files.catbox.moe/d801v2.png"; 
    }

    const reportText = `*🇭🇰⃟🇦🇱𝐒𝐀𝐑𝐀𝐃𝐀 𝐌𝐃🇭🇰⃟🇦🇱*

╭━━⟮🧧𝙸𝙽𝚂𝙿𝙴𝙲𝚃𝙾𝚁🧧⟯━━━━⚯
├───────────╮╭───╮ ͟
│📜.𝙶𝚁𝙾𝚄𝙿 𝙸𝙽𝙵𝙾𝚂││𝚅3.3│ ̶̲̅°̶
├───────────╯╰───╯° ͞
│📝𝙽𝙾𝙼: ${groupMetaData.subject || "𝙰𝚄𝙲𝚄𝙽"}
│🆔𝙸𝙳: ${groupMetaData.id}
│📅𝙲𝚁𝙴́𝙰𝚃𝙸𝙾𝙽: ${creationDate}
│👑𝙲𝚁𝙴́𝙰𝚃𝙴𝚄𝚁: ${creator}
│👥𝙼𝙴𝙼𝙱𝚁𝙴𝚂: ${size} 
│⚙️𝙰𝙲𝙲𝙴̀𝚂: ${status}
│📄𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽: 
└───⌥⎾⎾${groupMetaData.desc || "_𝙰𝚄𝙲𝚄𝙽𝙴 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽 𝙳𝚄 𝙶𝚁𝙾𝚄𝙿𝙴._"}⏌⏌
> 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐓𝐇𝐄 𝐒𝐋𝐈𝐌𝐄 𝐓𝐄𝐂𝐇 𝐄𝐌𝐏𝐈𝐑𝐄`;

    if (profilePicUrl) {
      await client.sendMessage(chat, {
        image: { url: profilePicUrl },
        caption: reportText,
        mentions: groupMetaData.owner ? [groupMetaData.owner] : [],
        ...channelInfo
      }, { quoted: fakeQuoted });
    } else {
      await client.sendMessage(chat, {
        text: reportText,
        mentions: groupMetaData.owner ? [groupMetaData.owner] : [],
        ...channelInfo
      }, { quoted: fakeQuoted });
    }

  } catch (error) {
    console.error(error);
    return await client.sendMessage(chat, {
      text: "> ❌ *Impossible d'inspecter ce groupe.*\n> Cela se produit si le lien a été réinitialisé, expiré, ou si le bot a été banni de ce groupe.",
      ...channelInfo
    }, { quoted: fakeQuoted });
  }
}

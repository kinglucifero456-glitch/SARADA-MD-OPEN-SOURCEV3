import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";

export default async function grouplinkCommand(message, client) {
  const chat = message.key.remoteJid;
  if (!chat.endsWith('@g.us')) {
    return client.sendMessage(chat, { 
      text: "> *❌ Cette commande ne peut être utilisée que dans un groupe.*", ...channelInfo
    }, { quoted: fakeQuoted });
  }

  try {
    let inviteCode;
    try {
      inviteCode = await client.groupInviteCode(chat);
    } catch (e) {
      inviteCode = await client.groupCreateInvite(chat);
    }

    const link = `https://chat.whatsapp.com/${inviteCode}`;
    await client.sendMessage(chat, { 
      text: `> 🔗 *Lien d'invitation du groupe :*\n${link}`, ...channelInfo
    }, { quoted: fakeQuoted });
  } catch (error) {
    await client.sendMessage(chat, { 
      text: `> ❌ Impossible de récupérer le lien : ${error.message}`, channelInfo
    }, { quoted: fakeQuoted });
  }
}
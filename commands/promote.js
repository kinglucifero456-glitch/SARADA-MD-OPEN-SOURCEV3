import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";
import { checkAdminPermission } from "../lib/adminUtils.js";

export default async function promoteCommand(message, client, { args }) {
  const chat = message.key.remoteJid;
  if (!chat.endsWith("@g.us")) return client.sendMessage(chat, { text: "> ❌ 𝐆𝐑𝐎𝐔𝐏𝐄 𝐔𝐍𝐈𝐐𝐔𝐄𝐌𝐄𝐍𝐓.", ...channelInfo }, { quoted: fakeQuoted });
  
  try {
    await checkAdminPermission(client, message, chat);
    
    const ctx = message.message?.extendedTextMessage?.contextInfo;
    let userToPromote = [];
    
    if (ctx?.mentionedJid && ctx.mentionedJid.length > 0) {
      userToPromote = ctx.mentionedJid;
    } else if (ctx?.participant) {
      userToPromote = [ctx.participant];
    } else if (args[0]) {
      const cleanedNum = args[0].replace(/[^0-9]/g, "");
      if (cleanedNum.length > 0) {
        userToPromote = [cleanedNum + "@s.whatsapp.net"];
      }
    }
    
    if (userToPromote.length === 0) {
      return client.sendMessage(chat, { text: "*> ❌ 𝐕𝐄𝐔𝐈𝐋𝐋𝐄𝐙 𝐌𝐄𝐍𝐓𝐈𝐎𝐍𝐍𝐄́ 𝐋'𝐔𝐓𝐈𝐋𝐈𝐒𝐀𝐓𝐄𝐔𝐑 𝐎𝐔 𝐑𝐄́𝐏𝐎𝐍𝐃𝐑𝐄 𝐀̀ 𝐒𝐎𝐍 𝐌𝐄𝐒𝐒𝐀𝐆𝐄 𝐀𝐕𝐄𝐂 𝐋𝐀 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐄 !*", ...channelInfo }, { quoted: fakeQuoted });
    }

    await client.groupParticipantsUpdate(chat, userToPromote, "promote");
    

    const usernames = userToPromote.map(jid => `@${jid.split('@')[0].split(':')[0].split('.')[0]}`);
    const promoterJid = client.user.id;
    const cleanPromoterJid = promoterJid.split('@')[0].split(':')[0].split('.')[0];
    
    const promotionMessage = `*❮❮❲ 𝐏𝐫𝐨𝐦𝐨𝐭𝐞 𝐑𝐞𝐩𝐨𝐫𝐭 ❳❯❯*\n` +
        `𓅷❥︎ *𝐔𝐭𝐢𝐥𝐢𝐬𝐚𝐭𝐞𝐮𝐫:* ${userToPromote.length > 1 ? 's' : ''}:\n` +
        `${usernames.map(name => `߷ ${name}`).join('\n')}\n` +
        `𓅷❥︎ *𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐚𝐛𝐥𝐞:*  @${cleanPromoterJid}\n` +
        `𓅷︎❥ *𝐃𝐚𝐭𝐞:* ${new Date().toLocaleString()}`;
        
    await client.sendMessage(chat, { 
        text: promotionMessage,
        mentions: [...userToPromote, promoterJid],
        ...channelInfo
    }, { quoted: fakeQuoted });

  } catch (err) {
    return client.sendMessage(chat, { text: `> *❌ 𝐄𝐑𝐑𝐄𝐔𝐑 : ${err.message || err}*`, ...channelInfo }, { quoted: fakeQuoted });
  }
}

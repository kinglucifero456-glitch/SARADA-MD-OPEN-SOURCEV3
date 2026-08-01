import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";
import { checkAdminPermission } from "../lib/adminUtils.js";

export default async function kickCommand(message, client, { args }) {
  const chat = message.key.remoteJid;
  if (!chat.endsWith("@g.us")) return client.sendMessage(chat, { text: "> *❌ 𝐆𝐑𝐎𝐔𝐏𝐄 𝐔𝐍𝐈𝐐𝐔𝐄𝐌𝐄𝐍𝐓.*", ...channelInfo }, { quoted: fakeQuoted });
  
  try {
    await checkAdminPermission(client, message, chat);
    
    const ctx = message.message?.extendedTextMessage?.contextInfo;
    let userToKick = [];
    
    if (ctx?.mentionedJid && ctx.mentionedJid.length > 0) {
      userToKick = ctx.mentionedJid;
    } else if (ctx?.participant) {
      userToKick = [ctx.participant];
    } else if (args[0]) {
      const cleanedNum = args[0].replace(/[^0-9]/g, "");
      if (cleanedNum.length > 0) {
        userToKick = [cleanedNum + "@s.whatsapp.net"];
      }
    }
    
    if (userToKick.length === 0) {
      return client.sendMessage(chat, { text: "> *❌ 𝐕𝐄𝐔𝐈𝐋𝐋𝐄𝐙 𝐌𝐄𝐍𝐓𝐈𝐎𝐍𝐍𝐄𝐑 𝐎𝐔 𝐑𝐄́𝐏𝐎𝐍𝐃𝐑𝐄 𝐀̀ 𝐒𝐎𝐍 𝐌𝐄𝐒𝐒𝐀𝐆𝐄 𝐏𝐎𝐔𝐑 𝐋'𝐄𝐗𝐏𝐔𝐋𝐒𝐄𝐑 !*", ...channelInfo }, { quoted: fakeQuoted });
    }

    await client.groupParticipantsUpdate(chat, userToKick, "remove");
    
    
    const usernames = userToKick.map(jid => `@${jid.split('@')[0].split(':')[0].split('.')[0]}`);
    const kickerJid = client.user.id;
    const cleanKickerJid = kickerJid.split('@')[0].split(':')[0].split('.')[0];
    
    const kickMessage = `*❮❮❲ 𝐊𝐢𝐜𝐤 𝐔𝐬𝐞𝐫 𝐑𝐞𝐩𝐨𝐫𝐭 ❳❯❯*\n` +
        `𓅷❥︎ *𝐄𝐱 𝐌𝐞𝐦𝐛𝐫𝐞:* ${userToKick.length > 1 ? 's' : ''}:\n` +
        `${usernames.map(name => `߷ ${name}`).join('\n')}\n` +
        `𓅷❥︎ *𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐚𝐛𝐥𝐞:* @${cleanKickerJid}\n` +
        `𓅷︎❥ *𝐃𝐚𝐭𝐞:* ${new Date().toLocaleString()}`;
        
    await client.sendMessage(chat, { 
        text: kickMessage,
        mentions: [...userToKick, kickerJid], 
        ...channelInfo
    }, { quoted: fakeQuoted });

  } catch (err) {
    return client.sendMessage(chat, { text: `*❌ 𝐄𝐑𝐑𝐄𝐔𝐑 : ${err.message || err}*`, ...channelInfo }, { quoted: fakeQuoted });
  }
}

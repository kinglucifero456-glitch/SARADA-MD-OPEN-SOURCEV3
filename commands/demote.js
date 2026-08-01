import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";
import { checkAdminPermission } from "../lib/adminUtils.js";

export default async function demoteCommand(message, client, { args }) {
  const chat = message.key.remoteJid;
  if (!chat.endsWith("@g.us")) return client.sendMessage(chat, { text: "> _*❌ 𝘾𝙤𝙢𝙢𝙖𝙣𝙙𝙚 𝙙𝙚 𝙂𝙧𝙤𝙪𝙥𝙚 𝙪𝙣𝙞𝙦𝙪𝙚𝙢𝙚𝙣𝙩_*", ...channelInfo }, { quoted: fakeQuoted });
  
  try {
    await checkAdminPermission(client, message, chat);
    
    const ctx = message.message?.extendedTextMessage?.contextInfo;
    let userToDemote = [];
    
    if (ctx?.mentionedJid && ctx.mentionedJid.length > 0) {
      userToDemote = ctx.mentionedJid;
    } else if (ctx?.participant) {
      userToDemote = [ctx.participant];
    } else if (args[0]) {
      const cleanedNum = args[0].replace(/[^0-9]/g, "");
      if (cleanedNum.length > 0) {
        userToDemote = [cleanedNum + "@s.whatsapp.net"];
      }
    }
    
    if (userToDemote.length === 0) {
      return client.sendMessage(chat, { text: "> *_❌ Veuillez mentionner l'utilisateur ou répondre à son message pour le destituer !_*", ...channelInfo }, { quoted: fakeQuoted });
    }

    await client.groupParticipantsUpdate(chat, userToDemote, "demote");
    
    const usernames = userToDemote.map(jid => `@${jid.split('@')[0].split(':')[0].split('.')[0]}`);
    const demoterJid = client.user.id;
    const cleanDemoterJid = demoterJid.split('@')[0].split(':')[0].split('.')[0];
    
    const demoteMessage = `*❮❮❲ 𝐃𝐞𝐦𝐨𝐭𝐞𝐝 𝐑𝐞𝐩𝐨𝐫𝐭 ❳❯❯*\n` +
        `𓅷❥︎ *𝐄𝐱 𝐀𝐝𝐦𝐢𝐧:* ${userToDemote.length > 1 ? 's' : ''}:\n` +
        `${usernames.map(name => `߷ ${name}`).join('\n')}\n` +
        `𓅷❥︎ *𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐚𝐛𝐥𝐞:* @${cleanDemoterJid}\n` +
        `𓅷︎❥ *𝐃𝐚𝐭𝐞:* ${new Date().toLocaleString()}`;
        
    await client.sendMessage(chat, { 
        text: demoteMessage,
        mentions: [...userToDemote, demoterJid],
        ...channelInfo
    }, { quoted: fakeQuoted });

  } catch (err) {
    return client.sendMessage(chat, { text: `> *_❌ 𝐄𝐑𝐑𝐄𝐔𝐑 : ${err.message || err}_*`, ...channelInfo }, { quoted: fakeQuoted });
  }
}

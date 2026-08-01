import { channelInfo } from "../lib/messageConfig.js";
import { fakeProduct } from "../lib/fproduct.js";

export default async function kickCommand(message, client) {
  try {
    const jid = message.key.remoteJid;

    if (!jid.endsWith("@g.us")) {
      return client.sendMessage(jid, {
        text: "> ❌ *Commande uniquement en groupe*",
        ...channelInfo
      }, { quoted: fakeProduct });
    }

    const context = message.message?.extendedTextMessage?.contextInfo;
    let target;

    
    if (context?.mentionedJid?.length > 0) {
      target = context.mentionedJid[0];
    }
    
    else if (context?.participant) {
      target = context.participant;
    }

    if (!target) {
      return client.sendMessage(jid, {
        text: "> ❌ *Mentionne ou réponds à un utilisateur*",
        ...channelInfo
      }, { quoted: fakeProduct });
    }

    await client.groupParticipantsUpdate(jid, [target], "remove");

    await client.sendMessage(jid, {
      text: `> ✅ *𝗨𝗧𝗜𝗟𝗜𝗦𝗔𝗧𝗘𝗨𝗥 𝗦𝗨𝗣𝗣𝗥𝗜𝗠É*`,
      ...channelInfo
    }, { quoted: fakeProduct });

  } catch (err) {
    console.error(err);
  }
}
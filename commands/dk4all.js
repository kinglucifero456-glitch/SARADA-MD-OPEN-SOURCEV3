import { channelInfo } from "../lib/messageConfig.js";
import { fakeProduct } from "../lib/fproduct.js";

export default async function kickallCommand(message, client) {
  try {
    const jid = message.key.remoteJid;

    if (!jid.endsWith("@g.us")) {
      return client.sendMessage(jid, {
        text: "> *❌ Groupe uniquement*",
        ...channelInfo
      }, { quoted: fakeProduct });
    }

    const metadata = await client.groupMetadata(jid);
    const participants = metadata.participants;

    const toKick = participants
      .map(p => p.id)
      .filter(id => id !== message.key.participant);

    for (let user of toKick) {
      try {
        await client.groupParticipantsUpdate(jid, [user], "remove");
      } catch {}
    }

    await client.sendMessage(jid, {
      text: "> 💀 𝗧𝗢𝗨𝐒 𝗟𝗘𝗦 𝗠𝗘𝗠𝗕𝗥𝗘𝗦 𝗘́𝗟𝗜𝗚𝗜𝗕𝗟𝗘𝗦 𝗢𝗡𝗧 É𝗧É  𝗘𝗫𝗣𝗨𝗟𝗦É𝗦",
      ...channelInfo
    }, { quoted: fakeProduct });

  } catch (err) {
    console.error(err);
  }
}
import { fakeQuoted } from "../lib/fquoted.js";
import { channelInfo } from "../lib/messageConfig.js";

export default async function getppCommand(message, client, { args }) {
  const chat = message.key.remoteJid;
  let user = args[0]?.includes("@") ? args[0] : message.key.participant || chat;
  try {
    const pp = await client.profilePictureUrl(user, "image");
    await client.sendMessage(chat, { image: { url: pp }, caption: `> *𝐏𝐇𝐎𝐓𝐎 𝐃𝐄 @${user.split("@")[0]}*`, mentions: [user], ...channelInfo }, { quoted: fakeQuoted });
  } catch {
    await client.sendMessage(chat, { text: "> *❌ 𝐀𝐔𝐂𝐔𝐍𝐄 𝐏𝐇𝐎𝐓𝐎 𝐓𝐑𝐎𝐔𝐕𝐄𝐄.*", ...channelInfo }, { quoted: fakeQuoted });
  }
}
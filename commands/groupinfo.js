import { channelInfo } from "../lib/messageConfig.js";
import { fakeQuoted } from "../lib/fquoted.js";

export default async function groupInfoCommand(message, client, { config }) {
  const chatId = message.key.remoteJid;

  if (!chatId.endsWith('@g.us')) {
    return client.sendMessage(chatId, {
      text: '> *❌ 𝐆𝐑𝐎𝐔𝐏𝐄 𝐔𝐍𝐈𝐐𝐔𝐄𝐌𝐄𝐍𝐓.*',
      ...channelInfo
    }, { quoted: fakeQuoted });
  }

  const groupMetadata = await client.groupMetadata(chatId);
  const participants = groupMetadata.participants;

  const adminCount = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length;
  const memberCount = participants.length;
  const creator = groupMetadata.owner || 'Inconnu';
  const description = groupMetadata.desc || 'Aucune description.';
  const groupName = groupMetadata.subject;
  const groupId = chatId;

  let caption = `\`──⟢🌹⟬𝐆𝐑𝐎𝐔𝐏𝐄 𝐈𝐍𝐅𝐎𝐒⟭🌹⟣──\`\n\n`;
  caption += `┃❯❯ *𝗡𝗢𝗠* : ${groupName}\n`;
  caption += `┃❯❯ *𝗜𝗗* : ${groupId}\n`;
  caption += `┃❯❯ *𝗖𝗥𝗘𝗔𝗧𝗘𝗨𝗥* : @${creator.split('@')[0]}\n`;
  caption += `┃❯❯ *𝗠𝗘𝗠𝗕𝗥𝗘𝗦* : ${memberCount}\n`;
  caption += `┃❯❯ *𝗔𝗗𝗠𝗜𝗡𝗦* : ${adminCount}\n`;
  caption += `┃❯❯ *𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗧𝗜𝗢𝗡* :\n${description}\n`;
  caption += `\n${config.addReply || ''}`;

  let profilePicUrl;
  try {
    profilePicUrl = await client.profilePictureUrl(chatId, 'image');
  } catch {
    profilePicUrl = null;
  }

  const mentions = [creator];

  if (profilePicUrl) {
    await client.sendMessage(chatId, {
      image: { url: profilePicUrl },
      caption,
      mentions,
      ...channelInfo
    }, { quoted: fakeQuoted });
  } else {
    await client.sendMessage(chatId, {
      text: caption,
      mentions,
      ...channelInfo
    }, { quoted: fakeQuoted });
  }
}
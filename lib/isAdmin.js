export async function isAdmin(client, chatId, userId) {
  try {
    const meta = await client.groupMetadata(chatId);
    const participants = meta.participants;
    const botId = client.user.id.split(":")[0];
    const isBotAdmin = participants.some(p => p.id.includes(botId) && p.admin);
    const isSenderAdmin = participants.some(p => p.id === userId && p.admin);
    return { isBotAdmin, isSenderAdmin };
  } catch {
    return { isBotAdmin: false, isSenderAdmin: false };
  }
}
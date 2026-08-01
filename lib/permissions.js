import config from "../config.js";

export function cleanJid(jid) {
  if (!jid) return "";
  return jid.split(":")[0].split("@")[0] + "@s.whatsapp.net";
}

export function isOwner(userId) {
  const cleaned = cleanJid(userId);
  return cleaned === cleanJid(config.ownerNumber) || cleaned.includes(config.ownerNumber);
}

export function isSudo(userId) {
  const cleaned = cleanJid(userId);
  return config.sudoNumbers.some(sudo => cleanJid(sudo) === cleaned || cleaned.includes(sudo));
}

export async function isAdminGroup(client, groupId, userId) {
  try {
    const target = cleanJid(userId);
    const meta = await client.groupMetadata(groupId);
    const participant = meta.participants.find(p => cleanJid(p.id) === target);
    return participant && (participant.admin === "admin" || participant.admin === "superadmin");
  } catch {
    return false;
  }
}

export async function isBotAdmin(client, groupId) {
  try {
    const botJid = cleanJid(client.user.id);
    const meta = await client.groupMetadata(groupId);
    return meta.participants.some(p => cleanJid(p.id) === botJid && (p.admin === "admin" || p.admin === "superadmin"));
  } catch {
    return false;
  }
}

export async function hasAdminAccess(client, msg, groupId, userId) {
  if (isOwner(userId) || isSudo(userId)) return true;
  const isAdmin = await isAdminGroup(client, groupId, userId);
  if (!isAdmin) throw new Error("❌ Vous n'êtes pas administrateur du groupe.");
  const botIsAdmin = await isBotAdmin(client, groupId);
  if (!botIsAdmin) throw new Error("❌ Le bot n'est pas administrateur du groupe.");
  return true;
}
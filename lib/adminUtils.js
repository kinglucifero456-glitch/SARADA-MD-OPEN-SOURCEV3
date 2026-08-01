import { isOwner, isSudo, isAdminGroup } from "./permissions.js";

export async function checkAdminPermission(client, msg, groupId) {
  const sender = msg.key.participant || msg.key.remoteJid;
  
  
  if (msg.key.fromMe || isOwner(sender) || isSudo(sender)) {
    return true;
  }
  

  const isAdmin = await isAdminGroup(client, groupId, sender);
  if (!isAdmin) {
    throw new Error("❌ Commande réservée aux administrateurs du groupe.");
  }
  return true;
}


export async function ensureBotAdmin(client, groupId) {
  return true; 
}

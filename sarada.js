import fs from "fs";
import path from "path";
import url from "url";
import config from "./config.js";
import { db } from "./lib/db.js"; 
import { isOwner, isSudo, isAdminGroup, isBotAdmin } from "./lib/permissions.js";
import { checkSpam } from "./lib/security.js";
import { fakeQuoted } from "./lib/fquoted.js";
import { channelInfo } from "./lib/messageConfig.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const commands = new Map();
const commandsPath = path.join(__dirname, "commands");
const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of files) {
  const commandName = file.replace(".js", "");
  const module = await import(`./commands/${file}`);
  commands.set(commandName, module.default);
}

const cooldowns = new Map();

export async function handleCommand(message, client) {
  try {
    const chat = message.key.remoteJid;
    const senderId = message.key.participant || message.key.remoteJid;
    const msg = message.message;
    if (!msg || !chat) return;

    let text = msg.conversation || msg.extendedTextMessage?.text || msg.imageMessage?.caption || msg.videoMessage?.caption || "";
    if (!text) return;

    
    const prefix = db.getPrefix();
    if (!text.startsWith(prefix)) return;

    if (checkSpam(senderId) && !isOwner(senderId)) {
      await client.sendMessage(chat, { text: "⏳ *Anti-spam* : ralentis !", ...channelInfo }, { quoted: fakeQuoted });
      return;
    }

    const args = text.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift()?.toLowerCase();
    if (!cmdName || !commands.has(cmdName)) return;

    
    const currentMode = db.getMode();
    if (currentMode === "private" && !message.key.fromMe && !isOwner(senderId) && !isSudo(senderId)) {
      return; 
    }

    let adminData = { isAdmin: false, isBotAdmin: false };
    if (chat.endsWith("@g.us")) {
      adminData.isAdmin = await isAdminGroup(client, chat, senderId);
      adminData.isBotAdmin = await isBotAdmin(client, chat);
    }

    const cmdKey = `${senderId}|${cmdName}`;
    if (cooldowns.has(cmdKey) && cooldowns.get(cmdKey) > Date.now() && !isOwner(senderId)) {
      const wait = Math.ceil((cooldowns.get(cmdKey) - Date.now()) / 1000);
      await client.sendMessage(chat, { text: `🕒 Attends ${wait}s avant de réutiliser cette commande.` }, { quoted: fakeQuoted });
      return;
    }
    cooldowns.set(cmdKey, Date.now() + 1500);

    const cmd = commands.get(cmdName);
    await cmd(message, client, {
      args,
      config,
      adminData,
      isOwner: message.key.fromMe || isOwner(senderId),
      isSudo: isSudo(senderId),
      chat,
      senderId
    });

  } catch (err) {
    console.error("❌ Handler error:", err);
  }
}

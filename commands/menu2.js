import os from "os";
import { db } from "../lib/db.js"; 
import { fakeQuoted } from "../lib/fquoted.js";
import { channelInfo } from "../lib/messageConfig.js";
function formatBytes(bytes) {
  if (bytes === 0) return "0 o";
  const k = 1024;
  const sizes = ["o", "Ko", "Mo", "Go", "To"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
const menuCategories = {
  "OWNER MENU": ["block", "unblock", "setmode", "setprefix", "creategroup"],
  "MAIN MENU": ["freebot", "owner", "ping", "alive", "uptime", "menu", "menu2"],
  "FUN MENU": ["ship", "animeeditz", "character", "pies", "trivia", "vda"],
  "ADMIN MENU": ["kick", "cgroupdesc", "cgroupname", "cgroupp", "add", "kickall", "kickdk229", "purge44", "promoteall", "promote", "demoteall", "demote", "groupmode", "hidetag",  "mute", "unmute", "resetlink"],
  "GROUP MENU": ["tagall", "groupinfo", "grouplink", "joingroup"],
  "DOWNLOAD MENU": ["github", "instagram", "img", "youtube", "song", "tiktok"],
  "TOOLS MENU": ["vv", "blur", "welcome", "goodbye", "fancy", "getpp", "setpp", "inspect", "jsencrypt", "removbg", "sticker", "sticker2", "take", "tourl"],
  "AI MENU": ["ai", "genai", "imagine", "realism"],
  "TEXT MENU": ["textmaker metallic", "textmaker fire", "textmaker ice", "textmaker snow", "textmaker hacker", "textmaker impressive", "textmaker matrix", "textmaker light", "textmaker neon", "textmaker devil", "textmaker purple", "textmaker leaves", "textmaker arena", "textmaker 1914", "textmaker thunder", "textmaker sans", "textmaker blackpink", "textmaker glitch"],
  "DANGER MENU": ["dk4", "dk4all"]
};
export default async function menuCommand(message, client, { config }) {
  const chat = message.key.remoteJid;
  const startTime = Date.now();
  const hostname = os.hostname();
  const serverId = process.env.SERVER_ID || "N/A";
  const cpuLoad = os.loadavg()[0].toFixed(2);
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const ramUsageStr = `${formatBytes(usedMem)} / ${formatBytes(totalMem)}`;
  const processMem = formatBytes(process.memoryUsage().heapUsed);
  const botSpeed = Date.now() - startTime;
  const totalCmds = Object.values(menuCategories).flat().length;
  let menuText = `╭━━❑ *${config.BotName}* ❑━━⚯\n`;
  menuText += `┃𓊈🩸𓊉 *𝐏𝐑𝐄𝐅𝐈𝐗* : \`${db.getPrefix()}\`\n`;
  menuText += `┃𓊈🩸𓊉 *𝐌𝐎𝐃𝐄* : ${db.getMode()}\n`;
  menuText += `┃𓊈🩸𓊉 *𝐎𝐖𝐍𝐄𝐑* : ${config.ownerNumber}\n`;
  menuText += `┃𓊈🩸𓊉 *𝐕𝐄𝐑𝐒𝐈𝐎𝐍* : *3.3*\n`;
  menuText += `┃𓊈🩸𓊉 *𝐂𝐌𝐃𝐒* : ${totalCmds}\n`;
  menuText += `╰━━━━━━━━━━━━━━━⚯\n\n`;
  menuText += `╭─❑ *𝐈𝐍𝐅𝐎𝐒 𝐒𝐘.𝐓.𝐌* ❑─⚯\n`;
  menuText += `┃☍╭⚬𝐋𝐚𝐭𝐞𝐧𝐜𝐲: ${botSpeed}ms\n`;
  menuText += `┃☍│⚬𝐇𝐨𝐬𝐭: ${hostname}\n`;
  menuText += `┃☍│⚬𝐈𝐃 𝐬𝐞𝐫𝐯𝐞𝐫: ${serverId}\n`;
  menuText += `┃☍│⚬𝐂𝐩𝐮: ${cpuLoad}\n`;
  menuText += `┃☍│⚬𝐑𝐚𝐦: ${ramUsageStr}\n`;
  menuText += `┃☍╰⚬𝐌𝐞𝐦𝐨𝐫𝐲: ${processMem}\n`;
  menuText += `╰━━━━━━━━━━━━━━━⚯\n\n`;
  menuText += `╭─❑ *COMMANDES* ❑─⚯\n`;
  for (const [category, commands] of Object.entries(menuCategories)) {
    if (commands.length > 0) {
      menuText += `┃ ⎘ *⎿${category}⏋*\n`;
      const formatted = commands.map(cmd => `\`${db.getPrefix()}${cmd}\``).join(" · ");
      menuText += `┃⌥⎋ *${formatted}*\n`;
    }
  }
  menuText += `╰━━━━━━━━━━━━━━━⚯\n`;

  menuText += config.addReply || "";

  try {
    await client.sendMessage(
      chat,
      {
        text: menuText,
        ...channelInfo
      },
      {
        quoted: fakeQuoted
      }
    );
  } catch (err) {
    console.error("Erreur lors de l'envoi du menu :", err);
  }
}
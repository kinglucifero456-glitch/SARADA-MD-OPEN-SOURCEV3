import fs from "fs";
import path from "path";
import { channelInfo } from "../lib/messageConfig2.js";
import { fakeQuoted } from "../lib/fquoted.js";

export default async function setmodeCommand(message, client, { args }) {
  const chat = message.key.remoteJid;
  
  if (!message.key.fromMe) {
    return client.sendMessage(chat, { text: "> *❌ 𝐒𝐄𝐔𝐋 𝐋'𝐔𝐓𝐈𝐋𝐈𝐒𝐀𝐓𝐄𝐔𝐑 𝐃𝐔 𝐁𝐎𝐓 𝐏𝐄𝐔𝐓 𝐄𝐗𝐄́𝐂𝐔𝐓𝐄𝐑 𝐂𝐄𝐓𝐓𝐄 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐄.*", ...channelInfo }, { quoted: fakeQuoted });
  }

  const value = args[0]?.toLowerCase();
  if (value !== "public" && value !== "private") {
    return client.sendMessage(chat, { text: "⚙️ 𝐔𝐓𝐈𝐋𝐈𝐒𝐀𝐓𝐈𝐎𝐍 : `.setmode public` ou `.setmode private`", ...channelInfo }, { quoted: fakeQuoted });
  }

  const dbPath = path.resolve("./database.json");
  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  if (!data.global) data.global = {};
  data.global.botMode = value;
  
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  return client.sendMessage(chat, { 
    text: `> 🤖 *𝐌𝐎𝐃𝐄 𝐆𝐋𝐎𝐁𝐀𝐋 𝐃𝐔 𝐁𝐎𝐓 𝐂𝐎𝐍𝐅𝐈𝐆𝐔𝐑𝐄́ 𝐒𝐔𝐑 :* ${value === "private" ? "🔒 PRIVÉ (Owner uniquement)" : "🔓 PUBLIC (Tout le monde)"}`, 
    ...channelInfo 
  }, { quoted: fakeQuoted });
}

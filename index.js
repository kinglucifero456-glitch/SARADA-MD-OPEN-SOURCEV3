import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateWAMessageFromContent,
    proto
} from "@whiskeysockets/baileys";
import pino from "pino";
import ffmpeg from "fluent-ffmpeg";
import readline from "readline";
import { Boom } from "@hapi/boom";
import { handleCommand } from "./sarada.js";
import { db } from './lib/db.js';
import config from "./config.js";
import path from "path";
import { fileURLToPath } from "url";
import { fakeQuoted } from "./lib/fquoted.js";
import { channelInfo } from "./lib/messageConfig.js";
import { handleWelcome } from "./commands/welcome.js";
import { handleGoodbye } from "./commands/goodbye.js";
import fs from "fs";

console.log(`🧩 Starting ${config.BotName}...`);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.join(__dirname, "temp");
const IMAGE_PATH = path.join(__dirname, "SlimeMedia/sarada.jpg");

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

const metadataCache = new Map();

async function getCachedGroupMetadata(client, chat) {
  const now = Date.now();
  if (metadataCache.has(chat)) {
    const cached = metadataCache.get(chat);
    if (now - cached.timestamp < 300000) {
      return cached.metadata;
    }
  }
  const metadata = await client.groupMetadata(chat);
  metadataCache.set(chat, { metadata, timestamp: now });
  return metadata;
}

const usePairingCode = true;
const question = (text) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(text, (ans) => { rl.close(); resolve(ans); }));
};

async function followNewsletter(client) {
  try {
    if (typeof client.newsletterFollow === "function") {
      await client.newsletterFollow(config.Newsletter);
      console.log(`✅ Suivi de la newsletter ${config.Newsletter}`);
    }
  } catch (error) {
    console.error("❌ Erreur newsletter:", error);
  }
}

function convertToOpus(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioCodec('libopus')
            .audioBitrate('64k')
            .audioChannels(1)
            .audioFrequency(16000)
            .format('ogg')
            .on('end', () => resolve(outputPath))
            .on('error', reject)
            .save(outputPath);
    });
}

async function sendConnectionNotification(client) {
    try {
        const myJid = client.user.id.split(":")[0] + "@s.whatsapp.net";

        const audioUrl = "https://files.catbox.moe/az719l.mp3";
        const audioResponse = await fetch(audioUrl);
        if (!audioResponse.ok) throw new Error(`HTTP ${audioResponse.status}`);
        
        const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
        if (audioBuffer.length === 0) throw new Error("Fichier audio vide");
        const tempMp3Path = path.join(TEMP_DIR, `input_${Date.now()}.mp3`);
        fs.writeFileSync(tempMp3Path, audioBuffer);
        const tempOpusPath = path.join(TEMP_DIR, `output_${Date.now()}.ogg`);
        await convertToOpus(tempMp3Path, tempOpusPath);
        if (!fs.existsSync(tempOpusPath) || fs.statSync(tempOpusPath).size === 0) {
            throw new Error("Conversion OPUS échouée");
        }

        const messageText = 
            `*SARADA MD* 𝐄𝐒𝐓 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄́ !\n\n` +
            `*𝐑𝐞́𝐣𝐨𝐢𝐧𝐬 𝐥𝐞 𝐠𝐫𝐨𝐮𝐩𝐞 𝐓𝐞𝐬𝐭 𝐁𝐨𝐭 𝐩𝐨𝐮𝐫 𝐭𝐞𝐬𝐭𝐞𝐫 𝐥𝐞𝐬 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐞𝐬*\n\n` +
            `> _𝗦𝗹𝗶𝗺𝗲 𝗧𝗲𝗰𝗵 𝗘𝗺𝗽𝗶𝗿𝗲_`;

        await client.sendMessage(myJid, {
            image: { url: IMAGE_PATH },
            caption: messageText,
            mimetype: "image/jpeg",
            contextInfo: channelInfo.contextInfo
        }, { quoted: fakeQuoted });

        await client.sendMessage(myJid, {
            audio: { url: tempOpusPath },
            mimetype: "audio/ogg; codecs=opus", 
            ptt: true
        }, { quoted: fakeQuoted });

        fs.unlinkSync(tempMp3Path);
        fs.unlinkSync(tempOpusPath);

        console.log("📬 Message de confirmation envoyé");

    } catch (err) {
        console.error("❌ Erreur notification :", err);
        try {
            const myJid = client.user.id.split(":")[0] + "@s.whatsapp.net";
            await client.sendMessage(myJid, {
                text: `> *✅ SARADA MD est connecté !*\n\n⚠️ *L'audio n'a pas pu être chargé.*\n\n> *𝐓𝐮 𝐃𝐞𝐯𝐫𝐚𝐢𝐬 𝐯𝐞́𝐫𝐢𝐟𝐢𝐞𝐫 𝐓𝐚 𝐜𝐨𝐧𝐧𝐞𝐱𝐢𝐨𝐧 𝐢𝐧𝐭𝐞𝐫𝐧𝐞𝐭 𝐞𝐭 𝐓𝐚 𝐯𝐞𝐫𝐬𝐢𝐨𝐧 𝐝𝐞 𝐖𝐡𝐚𝐭𝐬𝐚𝐩𝐩*`
            }, { quoted: fakeQuoted });
        } catch (fallbackErr) {
            console.error("❌ Fallback échoué :", fallbackErr);
        }
    }
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");
  const { version } = await fetchLatestBaileysVersion();

  const client = makeWASocket({
    version,
    printQRInTerminal: !usePairingCode,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    logger: pino({ level: "silent" }),
    auth: state,
  });

  if (usePairingCode && !client.authState.creds.registered) {
    const number = await question("📱 ENTRE TON NUMÉRO WHATSAPP (ex: 22656×××): ");
    const code = await client.requestPairingCode(number);
    console.log(`✅ CODE DE PAIRAGE: ${code}`);
  }

  client.ev.on("group-participants.update", async (update) => {
    metadataCache.delete(update.id);
    await handleWelcome(client, update);
    await handleGoodbye(client, update);
  });

  client.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      const msg = chatUpdate.messages[0];
      if (!msg || !msg.message) return;
      if (msg.key.remoteJid === "status@broadcast") return;

      const chat = msg.key.remoteJid;
      const isGroup = chat.endsWith('@g.us');
      const bodyText = msg.message?.conversation || 
                       msg.message?.extendedTextMessage?.text || 
                       msg.message?.imageMessage?.caption || 
                       msg.message?.videoMessage?.caption || "";

      if (isGroup) {
        const groupConfig = db.getGroup(chat);
        const sender = msg.key.participant || "";

        if (sender) {
          const groupMetadata = await getCachedGroupMetadata(client, chat);
          const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
          const isSenderAdmin = admins.includes(sender) || msg.key.fromMe;
          const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net';
          const isBotAdmin = admins.includes(botJid);

          if (!isSenderAdmin && isBotAdmin) {
            if (groupConfig.antilink) {
              const containsLink = /(https?:\/\/[^\s]+)/gi.test(bodyText);
              if (containsLink) {
                const cleanSender = sender.split('@')[0];
                await client.sendMessage(chat, { text: `🚩 *𝗔𝗡𝗧𝗜𝗟𝗜𝗡𝗞 𝗥𝗘𝗣𝗢𝗥𝗧 :* @${cleanSender} 𝗟'𝗲𝗻𝘃𝗼𝗶 𝗱𝗲 𝗹𝗶𝗲𝗻 𝗲𝘀𝘁 𝗶𝗻𝘁𝗲𝗿𝗱𝗶𝘁. 𝗘𝘅𝗽𝘂𝗹𝘀𝗶𝗼𝗻.`, mentions: [sender] });
                await client.groupParticipantsUpdate(chat, [sender], "remove");
                await client.sendMessage(chat, { delete: msg.key });
                return;
              }
            }

            if (groupConfig.antimedia) {
              const isMedia = msg.message?.imageMessage || msg.message?.videoMessage || msg.message?.audioMessage || msg.message?.documentMessage || msg.message?.stickerMessage;
              if (isMedia) {
                await client.sendMessage(chat, { delete: msg.key });
                return;
              }
            }

            if (groupConfig.antitag) {
              const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
              if (mentions.length > 3) {
                const cleanSender = sender.split('@')[0];
                await client.sendMessage(chat, { text: `🚩 *𝗔𝗡𝗧𝗜𝗧𝗔𝗚 𝗥𝗘𝗣𝗢𝗥𝗧 :* 𝗠𝗲𝗻𝘁𝗶𝗼𝗻 𝗱𝗲 𝗺𝗮𝘀𝘀𝗲 𝗶𝗻𝘁𝗲𝗿𝗱𝗶𝘁𝗲. 𝗘𝘅𝗽𝘂𝗹𝘀𝗶𝗼𝗻 𝗱𝗲  @${cleanSender}.`, mentions: [sender] });
                await client.groupParticipantsUpdate(chat, [sender], "remove");
                await client.sendMessage(chat, { delete: msg.key });
                return;
              }
            }
          }

          if (groupConfig.mode === "admin" && !isSenderAdmin) {
            const currentPrefix = db.getPrefix();
            if (bodyText.startsWith(currentPrefix)) {
              await client.sendMessage(chat, { delete: msg.key });
              return;
            }
          }
        }
      }

      await handleCommand(msg, client);

    } catch (error) {
      console.error("Erreur upsert :", error);
    }
  });

  client.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "open") {
      console.log(`✅ ${config.BotName} CONNECTÉ AVEC SUCCÈS !`);
      await followNewsletter(client);
      await sendConnectionNotification(client);
    } else if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log("❌ Session expirée.");
      } else {
        console.log("⚠️ Déconnexion, redémarrage...");
        startBot();
      }
    }
  });

  client.ev.on("creds.update", saveCreds);
}

startBot();
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import sharp from "sharp";
import { channelInfo } from "../lib/messageConfig.js";
import { fakeQuoted } from "../lib/fquoted.js";

export default async function stickerCommand(message, client) {
  const chat = message.key.remoteJid;
  const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (!quoted || (!quoted.imageMessage && !quoted.videoMessage)) {
    return client.sendMessage(chat, { text: "❌ Réponds à une image/vidéo avec .sticker", ...channelInfo }, { quoted: fakeQuoted });
  }
  try {
    const buffer = await downloadMediaMessage({ message: quoted }, "buffer", {}, { logger: client.logger, reuploadRequest: client.updateMediaMessage });
    let webpBuffer;
    if (quoted.imageMessage) {
      webpBuffer = await sharp(buffer).webp().toBuffer();
    } else {
      webpBuffer = await sharp(buffer).resize(512, 512).webp().toBuffer();
    }
    await client.sendMessage(chat, { sticker: webpBuffer, ...channelInfo }, { quoted: fakeQuoted });
  } catch (err) {
    console.error(err);
    await client.sendMessage(chat, { text: "❌ Erreur.", ...channelInfo }, { quoted: fakeQuoted });
  }
}
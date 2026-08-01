import { downloadContentFromMessage } from "@whiskeysockets/baileys";
import sharp from "sharp";
import { channelInfo } from "../lib/messageConfig.js";


export default async function blur(message, client) {
  const chat = message.key.remoteJid;

  const quoted =
    message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

  const img = quoted?.imageMessage || message.message?.imageMessage;

  if (!img) {
    return client.sendMessage(chat, {
      text: "> *❌ 𝑬𝑵𝑽𝑶𝑰 𝑶𝑼 𝑹𝑬𝑷𝑶𝑵𝑫 à 𝑼𝑵𝑬 𝑰𝑴𝑨𝑮𝑬*",
      ...channelInfo
    });
  }

  const stream = await downloadContentFromMessage(img, "image");
  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  const blurred = await sharp(buffer).blur(10).toBuffer();

  await client.sendMessage(chat, {
    image: blurred,
    caption: "*🇭🇰⃟🇦🇱𝗜𝗠𝗔𝗚𝗘 𝗕𝗟𝗨𝗥𝗥𝗘𝗗🇭🇰⃟🇦🇱*\n> 𝐒𝐀𝐑𝐀𝐃𝐀 𝐌𝐃 𝐕3.3",
    ...channelInfo
  });
}
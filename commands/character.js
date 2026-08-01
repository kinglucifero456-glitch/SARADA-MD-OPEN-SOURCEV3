import { channelInfo } from "../lib/messageConfig.js";
import { fakeQuoted } from "../lib/fquoted.js"; 

export default async function characterCommand(message, client) {
  try {
    const chat = message.key.remoteJid;

    let user;

    const ctx = message.message?.extendedTextMessage?.contextInfo;

    if (ctx?.mentionedJid?.length) {
      user = ctx.mentionedJid[0];
    } else if (ctx?.participant) {
      user = ctx.participant;
    }

    if (!user) {
      return await client.sendMessage(chat, {
        text: "❌ *_Mention quelqu’un ou répond à un message._*",
        ...channelInfo
      }, { quoted: fakeQuoted }); 
    }

    let pfp;
    try {
      pfp = await client.profilePictureUrl(user, "image");
    } catch {
      pfp = "https://files.catbox.moe/rpgxcf.jpg";
    }

    const traits = [
      "Intelligent","Creative","Determined","Ambitious","Caring",
      "Charismatic","Confident","Empathetic","Energetic","Friendly",
      "Generous","Honest","Humorous","Imaginative","Independent",
      "Intuitive","Kind","Logical","Loyal","Optimistic",
      "Passionate","Patient","Persistent","Reliable","Resourceful",
      "Sincere","Thoughtful","Understanding","Versatile","Wise"
    ];

    const shuffled = traits.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    const result = selected.map(t => {
      const p = Math.floor(Math.random() * 41) + 60;
      return `> 🌹 ${t}: ${p}%`;
    }).join("\n");

    const text = `\`*🇭🇰⃟🇦🇱* 𝗧𝗥𝗔𝗜𝗧𝗦 𝗖𝗛𝗔𝗥𝗔𝗖𝗧𝗘𝗥𝗦\`
*┏━━━━━━━━━━━━━━━━━━━━○*
*┃👤 @${user.split("@")[0]}*
*┗━━━━━━━━━━━━━━━━━━━━○*

${result}

*┏━━━━━━━━━━━━━━━━━━━○*
*┃👀 *𝐎𝐕𝐄𝐑𝐀𝐋𝐋* : ${Math.floor(Math.random() * 21) + 80}%*
*┗━━━━━━━━━━━━━━━━━━━○*`;

    await client.sendMessage(chat, {
      image: { url: pfp },
      caption: text,
      mentions: [user],
      ...channelInfo
    }, { quoted: fakeQuoted });

  } catch (e) {
    console.error("character error:", e);
  }
}
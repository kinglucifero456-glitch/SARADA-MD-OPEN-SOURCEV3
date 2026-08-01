import axios from 'axios';
import mumaker from 'mumaker';
import { channelInfo } from '../lib/messageConfig.js';
import { fakeQuoted } from '../lib/fquoted.js';

const messageTemplates = {
    error: (text) => ({
        text,
        ...channelInfo
    }),
    success: (imageUrl) => ({
        image: { url: imageUrl },
        caption: "> 🇭🇰⃟🇦🇱 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙴𝙳 𝙱𝚈 𝚂𝙰𝚁𝙰𝙳𝙰 𝙼𝙳 𝚅3.3 🇭🇰⃟🇦🇱",
        ...channelInfo
    })
};

export default async function textmakerCommand(message, client, { args }) {
    const chat = message.key.remoteJid;
    const type = args[0]?.toLowerCase();
    
    const text = args.slice(1).join(' ').trim();

    try {
        if (!type) {
            return await client.sendMessage(chat, 
                messageTemplates.error(`> ❌ 𝐒𝐏𝐄́𝐂𝐈𝐅𝐈𝐄𝐑 𝐔𝐍 𝐓𝐘𝐏𝐄 𝐃'𝐄𝐅𝐅𝐄𝐓.\n> 𝐄𝐗𝐄𝐌𝐏𝐋𝐄: \`.textmaker metallic MonTexte\``), 
                { quoted: fakeQuoted }
            );
        }

        if (!text) {
            return await client.sendMessage(chat, 
                messageTemplates.error(`> ❌ 𝐕𝐄𝐔𝐈𝐋𝐋𝐄𝐙 𝐅𝐎𝐔𝐑𝐍𝐈𝐑 𝐋𝐄 𝐓𝐄𝐗𝐓𝐄 𝐀̀ 𝐄́𝐂𝐑𝐈𝐑𝐄.\n> 𝐄𝐗𝐄𝐌𝐏𝐋𝐄: \`.textmaker ${type} MonTexte\``), 
                { quoted: fakeQuoted }
            );
        }

        await client.sendMessage(chat, { text: `> *🎨 𝐂𝐑𝐄́𝐀𝐓𝐈𝐎𝐍 𝐃𝐄 𝐋'𝐄𝐅𝐅𝐄𝐓 [${type}] 𝐄𝐍 𝐂𝐎𝐔𝐑𝐒...*` });

        let result;
        
        switch (type) {
            case 'metallic':
                result = await mumaker.ephoto("https://en.ephoto360.com/impressive-decorative-3d-metal-text-effect-798.html", text);
                break;
            case 'ice':
                result = await mumaker.ephoto("https://en.ephoto360.com/ice-text-effect-online-101.html", text);
                break;
            case 'snow':
                result = await mumaker.ephoto("https://en.ephoto360.com/create-a-snow-3d-text-effect-free-online-621.html", text);
                break;
            case 'impressive':
                result = await mumaker.ephoto("https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html", text);
                break;
            case 'matrix':
                result = await mumaker.ephoto("https://en.ephoto360.com/matrix-text-effect-154.html", text);
                break;
            case 'light':
                result = await mumaker.ephoto("https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html", text);
                break;
            case 'neon':
                result = await mumaker.ephoto("https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html", text);
                break;
            case 'devil':
                result = await mumaker.ephoto("https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html", text);
                break;
            case 'purple':
                result = await mumaker.ephoto("https://en.ephoto360.com/purple-text-effect-online-100.html", text);
                break;
            case 'thunder':
                result = await mumaker.ephoto("https://en.ephoto360.com/thunder-text-effect-online-97.html", text);
                break;
            case 'leaves':
                result = await mumaker.ephoto("https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html", text);
                break;
            case '1917':
                result = await mumaker.ephoto("https://en.ephoto360.com/1917-style-text-effect-523.html", text);
                break;
            case 'arena':
                result = await mumaker.ephoto("https://en.ephoto360.com/create-cover-arena-of-valor-by-mastering-360.html", text);
                break;
            case 'hacker':
                result = await mumaker.ephoto("https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html", text);
                break;
            case 'sand':
                result = await mumaker.ephoto("https://en.ephoto360.com/write-names-and-messages-on-the-sand-online-582.html", text);
                break;
            case 'blackpink':
                result = await mumaker.ephoto("https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html", text);
                break;
            case 'glitch':
                result = await mumaker.ephoto("https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html", text);
                break;
            case 'fire':
                result = await mumaker.ephoto("https://en.ephoto360.com/flame-lettering-effect-372.html", text);
                break;
            default:
                return await client.sendMessage(chat, 
                    messageTemplates.error(`❌ 𝐓𝐘𝐏𝐄 "${type}" 𝐈𝐍𝐂𝐎𝐍𝐍𝐔.\n𝐓𝐘𝐏𝐄𝐒 𝐕𝐀𝐋𝐈𝐃𝐄𝐒:\n\`metallic\`, \`ice\`, \`snow\`, \`matrix\`, \`neon\`, \`hacker\`, \`glitch\`, \`fire\`, \`blackpink\`, \`sand\`, \`arena\`, \`1917\`, \`leaves\`, \`thunder\`, \`purple\`, \`devil\`, \`light\`, \`impressive\``), 
                    { quoted: fakeQuoted }
                );
        }

        if (!result || !result.image) {
            throw new Error('Aucune URL d\'image renvoyée par l\'API');
        }

        await client.sendMessage(chat, 
            messageTemplates.success(result.image), 
            { quoted: fakeQuoted }
        );

    } catch (error) {
        console.error('Error in textmaker command:', error);
        await client.sendMessage(chat, 
            messageTemplates.error(`> ❌ 𝐔𝐍𝐄 𝐄𝐑𝐑𝐄𝐔𝐑 𝐄𝐒𝐓 𝐒𝐔𝐑𝐕𝐄𝐍𝐔𝐄 : ${error.message}`), 
            { quoted: fakeQuoted }
        );
    }
}

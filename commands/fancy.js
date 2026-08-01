import { channelInfo } from "../lib/messageConfig.js";
import { fakeQuoted } from '../lib/fquoted.js';
const cursiveMap = {
  a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: '𝑒', f: '𝒻', g: '𝑔', h: '𝒽', i: '𝒾', j: '𝒿', k: '𝓀',
  l: '𝓁', m: '𝓂', n: '𝓃', o: '𝑜', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉', u: '𝓊',
  v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏',
  A: '𝒜', B: '𝐵', C: '𝒞', D: '𝒟', E: '𝐸', F: '𝐹', G: '𝒢', H: '𝐻', I: '𝐼', J: '𝒥',
  K: '𝒦', L: '𝐿', M: '𝑀', N: '𝒩', O: '𝒪', P: '𝒫', Q: '𝒬', R: '𝑅', S: '𝒮', T: '𝒯',
  U: '𝒰', V: '𝒱', W: '𝒲', X: '𝒳', Y: '𝒴', Z: '𝒵'
};

const boldMap = {
  a: '𝐚', b: '𝐛', c: '𝐜', d: '𝐝', e: '𝐞', f: '𝐟', g: '𝐠', h: '𝐡', i: '𝐢', j: '𝐣',
  k: '𝐤', l: '𝐥', m: '𝐦', n: '𝐧', o: '𝐨', p: '𝐩', q: '𝐪', r: '𝐫', s: '𝐬', t: '𝐭',
  u: '𝐮', v: '𝐯', w: '𝐰', x: '𝐱', y: '𝐲', z: '𝐳',
  A: '𝐀', B: '𝐁', C: '𝐂', D: '𝐃', E: '𝐄', F: '𝐅', G: '𝐆', H: '𝐇', I: '𝐈', J: '𝐉',
  K: '𝐊', L: '𝐋', M: '𝐌', N: '𝐍', O: '𝐎', P: '𝐏', Q: '𝐐', R: '𝐑', S: '𝐒', T: '𝐓',
  U: '𝐔', V: '𝐕', W: '𝐖', X: '𝐗', Y: '𝐘', Z: '𝐙'
};

const italicMap = {
  a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧', g: '𝘨', h: '𝘩', i: '𝘪', j: '𝘫',
  k: '𝘬', l: '𝘭', m: '𝘮', n: '𝘯', o: '𝘰', p: '𝘱', q: '', r: '𝘳', s: '𝘴', t: '𝘵',
  u: '𝘶', v: '𝘷', w: '𝘸', x: '𝘹', y: '𝘺', z: '𝘻',
  A: '𝘈', B: '𝘉', C: '𝘊', D: '𝘋', E: '𝘌', F: '𝘍', G: '𝘎', H: '𝘏', I: '𝘐', J: '𝘑',
  K: '𝘒', L: '𝘓', M: '𝘔', N: '𝘕', O: '𝘖', P: '𝘗', Q: '𝘘', R: '𝘙', S: '𝘚', T: '𝘛',
  U: '𝘜', V: '𝘝', W: '𝘞', X: '𝘟', Y: '𝘠', Z: '𝘡'
};

const boldItalicMap = {
  a: '𝙖', b: '𝙗', c: '𝙘', d: '𝙙', e: '𝙚', f: '𝙛', g: '𝙜', h: '𝙝', i: '𝙞', j: '𝙟',
  k: '𝙠', l: '𝙡', m: '𝙢', n: '𝙣', o: '𝙤', p: '𝙥', q: '𝙦', r: '𝙧', s: '𝙨', t: '𝙩',
  u: '𝙪', v: '𝙫', w: '𝙬', x: '𝙭', y: '𝙮', z: '𝙯',
  A: '𝘼', B: '𝘽', C: '𝘾', D: '𝘿', E: '𝙀', F: '𝙁', G: '𝙂', H: '𝙃', I: '𝙄', J: '𝙅',
  K: '𝙆', L: '𝙇', M: '𝙈', N: '𝙉', O: '𝙊', P: '𝙋', Q: '𝙌', R: '𝙍', S: '𝙎', T: '𝙏',
  U: '𝙐', V: '𝙑', W: '𝙒', X: '𝙓', Y: '𝙔', Z: '𝙕'
};

const squaredMap = {
  A: '🄰', B: '🄱', C: '🄲', D: '🄳', E: '🄴', F: '🄵', G: '🄶', H: '🄷', I: '🄸', J: '🄹',
  K: '🄺', L: '🄻', M: '🄼', N: '🄽', O: '🄾', P: '🄿', Q: '🅀', R: '🅁', S: '🅂', T: '🅃',
  U: '🅄', V: '🅅', W: '🅆', X: '🅇', Y: '🅈', Z: '🅉'
};

const classicFonts = [
    (t) => t, 
    (t) => t.toUpperCase(),
    (t) => t.toLowerCase(),
    (t) => [...t].map(c => cursiveMap[c] || c).join(''), 
    (t) => [...t].map(c => boldMap[c] || c).join(''),   
    (t) => [...t].map(c => italicMap[c] || c).join(''),  
    (t) => [...t].map(c => boldItalicMap[c] || c).join(''), 
    (t) => `\`\`\`${t}\`\`\`,`, 
    (t) => [...t].map(c => 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ'['abcdefghijklmnopqrstuvwxyz'.indexOf(c.toLowerCase())] || c).join(''),
    (t) => [...t].map(c => squaredMap[c.toUpperCase()] || c).join(''), 
    (t) => [...t].map(c => `(${c})`).join(''), 
    (t) => [...t].map(c => `ꓯBCDƎꞒƑƓHIſꞰꞭꞤOꞮꞰꞰꞰꞰꞰꞰꞰꞰꞰ`['ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(c.toUpperCase())] || c).join(''), 
    (t) => [...t].map(c => c + 'ͤ').join(''),
    (t) => t.split('').join(' '),
    (t) => t.split('').map(c => c + '͜͡').join(''), 
    (t) => `༎${t}༎`, 
    (t) => `「${t}」`, 
    (t) => `『★${t}★』`,
    (t) => `⟦${t}⟧`, 
    (t) => `*${t}*`,
];

const decorativeFonts = [
    (t) => `🧩 ${t} 🧩`,
    (t) => `ღ ${t.toUpperCase()} ღ`,
    (t) => [...t].map(c => `💀${c}`).join(''),
    (t) => `༺༒ ${t} ༒༻`,
    (t) => `༼ ${t} ༽`,
    (t) => `★彡 ${t} 彡★`,
    (t) => `၌${t.toUpperCase()}၌`,
    (t) => `⫷ ${t} ⫸`,
    (t) => `❝${t}❞`,
    (t) => `✧･ﾟ: *✧･ﾟ:* ${t} *:･ﾟ✧*:･ﾟ✧`,
];

const fancyFonts = [...classicFonts, ...decorativeFonts];

export async function fancyCommand(message, client, { args }) {
    const remoteJid = message.key.remoteJid;
    
    if (!args || args.length === 0) {
        const sampleText = 'SARADA MD';
        const preview = fancyFonts.map((f, i) => `*${i + 1}.* ${f(sampleText)}`).join('\n\n');
        
        return await client.sendMessage(remoteJid, { 
            text: `🪄 *𝐒𝐓𝐘𝐋𝐄𝐒 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄𝐒*\n\n> Utilisez \`.fancy [numéro] [votre texte]\` pour appliquer un style\n\n${preview}`,
            ...channelInfo 
        }, { quoted: fakeQuoted });
    }

    if (isNaN(parseInt(args[0]))) {
        const sampleText = args.join(' ');
        const preview = fancyFonts.map((f, i) => `*${i + 1}.* ${f(sampleText)}`).join('\n\n');

        return await client.sendMessage(remoteJid, { 
            text: `🪄 *𝐕𝐎𝐒 𝐒𝐓𝐘𝐋𝐄𝐒 𝐏𝐄𝐑𝐒𝐎𝐍𝐍𝐀𝐋𝐈𝐒𝐄́𝐒*\n\n> Choisissez votre numéro favori en faisant \`.fancy [numéro] ${sampleText}\` :\n\n${preview}`,
            ...channelInfo 
        }, { quoted: fakeQuoted });
    }

    const styleIndex = parseInt(args[0]) - 1;
    const content = args.slice(1).join(' ').trim();

    if (styleIndex < 0 || styleIndex >= fancyFonts.length) {
        return await client.sendMessage(remoteJid, {
            text: `> ❌ Style invalide. Utilisez \`.fancy\` pour voir la liste.`,
            ...channelInfo
        }, { quoted: fakeQuoted });
    }

    if (!content) {
        return await client.sendMessage(remoteJid, {
            text: `> ⚠️ Veuillez fournir le texte à styliser.\nExemple: \`.fancy ${styleIndex + 1} Hello World\``,
            ...channelInfo
        }, { quoted: fakeQuoted });
    }

    const styledText = fancyFonts[styleIndex](content);

    const interactiveMessage = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { 
                        text: `⚜️ ${styledText} ⚜️` 
                    },
                    footer: { 
                        text: channelInfo.forwardedNewsletterMessageInfo?.newsletterName || "𝐒𝐀𝐑𝐀𝐃𝐀 𝐌𝐃" 
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "cta_copy",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "📋 COPIER LE STYLE",
                                    id: "copy_text",
                                    copy_code: styledText
                                })
                            }
                        ],
                        messageVersion: 1
                    },
                    contextInfo: { ...channelInfo }
                }
            }
        }
    };

    await client.relayMessage(remoteJid, interactiveMessage, { messageId: message.key.id });
}

export default fancyCommand;

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { channelInfo } from '../lib/messageConfig.js';
import { fakeQuoted } from '../lib/fquoted.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATE_FILE = path.join(__dirname, '../data/welcome_state.json');
const WELCOME_IMAGE = path.join(__dirname, '../automatisation/welcome.jpg');

function isWelcomeEnabled(groupId) {
  if (!fs.existsSync(STATE_FILE)) return false;
  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  return state[groupId] === true;
}

function setWelcomeState(groupId, enabled) {
  let state = {};
  if (fs.existsSync(STATE_FILE)) {
    state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  }
  state[groupId] = enabled;
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export async function handleWelcome(client, update) {
  const { id: groupId, participants, action } = update;
  if (action !== 'add') return;
  if (!isWelcomeEnabled(groupId)) return;

  const imageExists = fs.existsSync(WELCOME_IMAGE);

  for (const participant of participants) {
    try {
      const jid = typeof participant === 'string' 
        ? participant 
        : participant.id || participant.jid || participant;

      if (!jid || !jid.includes('@')) {
        console.warn(`⚠️ JID invalide pour participant :`, participant);
        continue;
      }

      const metadata = await client.groupMetadata(groupId);
      const participantsList = metadata.participants;
      const memberCount = participantsList.length;
      const adminCount = participantsList.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length;
      const creator = metadata.owner || 'Inconnu';
      const description = metadata.desc || 'Aucune description.';
      const groupName = metadata.subject;

      const index = participantsList.findIndex(p => p.id === jid) + 1;
      const ordinal = index === 1 ? '1er' : `${index}ème`;

      const caption = `┏━━━━━━━━━━━━━━━━━━⟢\n┃ *🇭🇰⃟🇦🇱𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐔𝐄🇭🇰⃟🇦🇱*\n┗━━━━⚯` +
        `@${jid.split('@')[0]} 𝗮 𝗿𝗲𝗷𝗼𝗶𝗻𝘁 *${groupName}* !\n` +
        `> ⎋ *𝗻° 𝗺𝗲𝗺𝗯𝗿𝗲* : ${ordinal}\n` +
        `> ⎋ *𝗺𝗲𝗺𝗯𝗿𝗲𝘀 𝗮𝗰𝘁𝘂* : ${memberCount}\n` +
        `> ⎋ *𝗮𝗱𝗺𝗶𝗻𝘀 𝗮𝗰𝘁𝘂* : ${adminCount}\n` +
        `> ⎋ *𝗰𝗿𝗲𝗮𝘁𝗲𝘂𝗿* : @${creator.split('@')[0]}\n` +
        `> ⎅ *𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻* :\n〘〘${description}〙〙\n` +
        `┏━━━━⚯\n┃🇭🇰⃟🇦🇱𝗦𝗔𝗥𝗔𝗗𝗔 𝗠𝗗🇭🇰⃟🇦🇱\n┗━━━━━━━━━━━━━━━━━⟢`;

      const mentions = [jid, creator];

      if (imageExists) {
        await client.sendMessage(groupId, {
          image: { url: WELCOME_IMAGE },
          caption: caption,
          mentions: mentions,
          contextInfo: channelInfo.contextInfo
        }, { quoted: fakeQuoted });
      } else {
        await client.sendMessage(groupId, {
          text: caption,
          mentions: mentions,
          contextInfo: channelInfo.contextInfo
        }, { quoted: fakeQuoted });
      }
    } catch (err) {
      console.error(`Erreur welcome pour ${JSON.stringify(participant)} dans ${groupId}:`, err);
    }
  }
}

export default async function welcomeCommand(message, client, { args }) {
  const chatId = message.key.remoteJid;
  if (!chatId.endsWith('@g.us')) {
    return client.sendMessage(chatId, {
      text: '> *❌ 𝐂𝐄𝐓𝐓𝐄 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐄 𝐍𝐄 𝐏𝐄𝐔𝐓 𝐄̂𝐓𝐑𝐄 𝐔𝐓𝐈𝐋𝐈𝐒𝐄́𝐄 𝐃𝐀𝐍𝐒 𝐔𝐍 𝐆𝐑𝐎𝐔𝐏𝐄.*',
      contextInfo: channelInfo.contextInfo,
    }, { quoted: fakeQuoted });
  }

  const subCommand = args[0]?.toLowerCase();
  if (!['on', 'off'].includes(subCommand)) {
    const state = isWelcomeEnabled(chatId) ? '✅ activé' : '❌ désactivé';
    return client.sendMessage(chatId, {
      text: `> *⚠️ \`𝐔𝐓𝐈𝐋𝐈𝐒𝐀𝐓𝐈𝐎𝐍\` : !welcome on/off*\n> *𝐄́𝐓𝐀𝐓 𝐀𝐂𝐓𝐔𝐄𝐋 : \`${state}\`*`,
      contextInfo: channelInfo.contextInfo,
    }, { quoted: fakeQuoted });
  }

  const enabled = subCommand === 'on';
  setWelcomeState(chatId, enabled);
  const status = enabled ? 'activés' : 'désactivés';
  await client.sendMessage(chatId, {
    text: `> *☑️ 𝐌𝐄𝐒𝐒𝐀𝐆𝐄𝐒 𝐃𝐄 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐔 \`${status}\` 𝐏𝐎𝐔𝐑 𝐂𝐄 𝐆𝐑𝐎𝐔𝐏𝐄.*`,
    contextInfo: channelInfo.contextInfo,
  }, { quoted: fakeQuoted });
}
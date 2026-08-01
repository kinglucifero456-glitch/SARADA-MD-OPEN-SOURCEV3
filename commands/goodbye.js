import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { channelInfo } from '../lib/messageConfig.js';
import { fakeQuoted } from '../lib/fquoted.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATE_FILE = path.join(__dirname, '../data/goodbye_state.json');
const GOODBYE_IMAGE = path.join(__dirname, '../automatisation/goodbye.jpg');

function isGoodbyeEnabled(groupId) {
  if (!fs.existsSync(STATE_FILE)) return false;
  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  return state[groupId] === true;
}

function setGoodbyeState(groupId, enabled) {
  let state = {};
  if (fs.existsSync(STATE_FILE)) {
    state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  }
  state[groupId] = enabled;
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export async function handleGoodbye(client, update) {
  const { id: groupId, participants, action } = update;
  if (action !== 'remove') return;
  if (!isGoodbyeEnabled(groupId)) return;

  const imageExists = fs.existsSync(GOODBYE_IMAGE);

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
      const groupName = metadata.subject;

      const caption = `⊶━━🌺⎿⌊𝗚𝗼𝗼𝗱𝗕𝘆𝗲⌉⏋🌺━━⊷\n\n` +
        `⎎⎎ @${jid.split('@')[0]} 𝗮 𝗾𝘂𝗶𝘁𝘁𝗲́ *${groupName}* ⎎⎎\n` +
        `> ⎋ *𝗺𝗲𝗺𝗯𝗿𝗲𝘀 𝗿𝗲𝘀𝘁𝗮𝗻𝘁𝘀* : ${memberCount}\n` +
        `> ⎋ *𝗮𝗱𝗺𝗶𝗻𝘀 𝗿𝗲𝘀𝘁𝗮𝗻𝘁𝘀* : ${adminCount}\n\nSlime md v1: t.me/sarada_md\n𝘂𝘁𝗶𝗹𝗶𝘀𝗲 𝗹𝗮 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝗲 "𝗳𝗿𝗲𝗲𝗯𝗼𝘁" 𝗽𝗼𝘂𝗿 𝗹𝗲 𝘁𝘂𝘁𝗼𝗿𝗶𝗲𝗹 𝗱𝗲 𝗱𝗲́𝗽𝗹𝗼𝗶𝗲𝗺𝗲𝗻𝘁`;

      const mentions = [jid];

      if (imageExists) {
        await client.sendMessage(groupId, {
          image: { url: GOODBYE_IMAGE },
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
      console.error(`Erreur goodbye pour ${JSON.stringify(participant)} dans ${groupId}:`, err);
    }
  }
}

export default async function goodbyeCommand(message, client, { args }) {
  const chatId = message.key.remoteJid;
  if (!chatId.endsWith('@g.us')) {
    return client.sendMessage(chatId, {
      text: '> _*❌ Cette commande ne peut être utilisée que dans un groupe.*_',
      contextInfo: channelInfo.contextInfo,
    }, { quoted: fakeQuoted });
  }

  const subCommand = args[0]?.toLowerCase();
  if (!['on', 'off'].includes(subCommand)) {
    const state = isGoodbyeEnabled(chatId) ? '✅ activé' : '❌ désactivé';
    return client.sendMessage(chatId, {
      text: `⚠️ *𝐔𝐓𝐈𝐋𝐈𝐒𝐀𝐓𝐈𝐎𝐍* : !goodbye on/off\n𝐄́𝐓𝐀𝐓 𝐀𝐂𝐓𝐔𝐄𝐋: ${state}`,
      contextInfo: channelInfo.contextInfo,
    }, { quoted: fakeQuoted });
  }

  const enabled = subCommand === 'on';
  setGoodbyeState(chatId, enabled);
  const status = enabled ? 'activés' : 'désactivés';
  await client.sendMessage(chatId, {
    text: `> *✅ 𝐌𝐄𝐒𝐒𝐀𝐆𝐄𝐒 𝐃'𝐀𝐔 𝐑𝐄́𝐕𝐎𝐈𝐑 \`${status}\` 𝐏𝐎𝐔𝐑 𝐂𝐄 𝐆𝐑𝐎𝐔𝐏𝐄.*`,
    contextInfo: channelInfo.contextInfo,
  }, { quoted: fakeQuoted });
}
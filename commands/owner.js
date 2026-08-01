export default async function ownerCommand(message, client) {
  const chat = message.key.remoteJid;

  const vcard = 
    'BEGIN:VCARD\n' +
    'VERSION:3.0\n' +
    'N:;Urgence;;;\n' +
    'FN:THE BLACK KING LUCIFERO\n' +
    'ORG:THE SLIME TECH EMPIRE;\n' +
    'TITLE: Urgence\n' +
    'TEL;type=CELL;type=VOICE;waid=22606527293:+226 06 52 72 93\n' +
    'END:VCARD';

  await client.sendMessage(
    chat,
    {
      contacts: {
        displayName: "OWNER CONTACT",
        contacts: [{ vcard }]
      }
    },
    { quoted: message }
  );
}

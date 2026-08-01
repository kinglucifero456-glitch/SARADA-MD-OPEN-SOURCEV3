export function buildCascadeQuoted(messageA, messageB) {
  const quotedCascade = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast"
    },
    message: {
      conversation: messageB 
    },
    contextInfo: {
      quotedMessage: {
        conversation: messageA
      }
    }
  };
  return quotedCascade;
}
import { channelInfo } from "../lib/messageConfig.js";

export default async function githubCommand(message, client, { args }) {
  const url = args[0];

  if (!url || !url.includes("github.com")) {
    return client.sendMessage(message.key.remoteJid, {
      text: "> *❌ 𝐋𝐈𝐄𝐍 𝐆𝐈𝐓𝐇𝐔𝐁 𝐈𝐍𝐕𝐀𝐋𝐈𝐃𝐄: 𝐃𝐨𝐧𝐧𝐞 𝐥𝐞 𝐥𝐢𝐞𝐧 𝐝𝐮 𝐫𝐞𝐩𝐨 𝐠𝐢𝐭𝐡𝐮𝐛 à 𝐭é𝐥é𝐜𝐡𝐚𝐫𝐠𝐞𝐫*",
      ...channelInfo
    });
  }

  try {
    const parts = url.split("/");
    const user = parts[3];
    const repo = parts[4];

    const zipUrl = `https://github.com/${user}/${repo}/archive/refs/heads/main.zip`;

    await client.sendMessage(message.key.remoteJid, {
      document: { url: zipUrl },
      mimetype: "application/zip",
      fileName: `𝐒𝐀𝐑𝐀𝐃𝐀_𝐕3-${repo}.zip`
    });

  } catch (e) {
    console.error(e);
    client.sendMessage(message.key.remoteJid, {
      text: "> *❌ 𝐄𝐑𝐑𝐄𝐔𝐑 𝐆𝐈𝐓𝐇𝐔𝐁*",
      ...channelInfo
    });
  }
}
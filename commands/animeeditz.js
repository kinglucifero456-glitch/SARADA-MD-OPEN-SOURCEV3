import { channelInfo } from "../lib/messageConfig.js";
import { fakeQuoted } from "../lib/fquoted.js";
const videos = [
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__arvix.vfx_1785506668374_wpmxki.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__fajix5.ae0_1785506886888_thnxde.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__..lorenzoo_1785506961824_dhaoyn.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io___tsukira_1785506537566_hpthqx.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__edt_benz_1785507093896_yilmn3.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__astafyp.__1785507016492_nuww6a.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__snauzk_1785506846123_rmaouy.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__zeefree.edit_1785506427886_rffxa8.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__aqurr_1785506620821_ttwqnd.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__rayto324_1785506602474_fvgdhv.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__frnndezz.ae_1785506915829_rabacv.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__dekuxman_1785507059932_xvwdot.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__akimanovv_1785507504147_yn56lu.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__r4m4y_1785507255834_ofcjs7.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__archisanitectum_1785507329953_xvw1ao.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__archisanitectum_1785507308117_asbqcz.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__yoon_dongju_1785507199520_kbitye.mp4",
    "https://res.cloudinary.com/iarmxzp3/video/upload/ssstik.io__kyoka.after_1785507448886_vg9xg5.mp4"
];

export default async function animeeditzCommand(message, client) {
    const chat = message.key.remoteJid;

    try {
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        await client.sendMessage(
            chat,
            {
                video: { url: randomVideo },
                ptv: true, 
                ...channelInfo
            },
            { quoted: fakeQuoted }
        );
    } catch (error) {
        console.error("Erreur dans la commande animeeditz :", error);
        await client.sendMessage(
            chat,
            { text: "> ❌ *Erreur lors de l'envoi de l'edit anime.*" },
            { quoted: fakeQuoted }
        );
    }
}

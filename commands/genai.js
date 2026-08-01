export default async function genaiCommand(message, client) {
    const chat = message.key.remoteJid;
    const sender = message.key.participant || message.key.remoteJid;

    try {
        await client.relayMessage(chat, {
            messageContextInfo: {
                threadId: [],
                deviceListMetadata: { senderKeyIndexes: [], recipientKeyIndexes: [] },
                deviceListMetadataVersion: 2,
                botMetadata: { messageDisclaimerText: "", richResponseSourcesMetadata: { sources: [] } }
            },
            botForwardedMessage: {
                message: {
                    richResponseMessage: {
                        submessages: [
                            { messageType: 2, messageText: "Slime Tech format test" },
                            { messageType: 2, messageText: "Hyperlink trusted: click here" },
                            { messageType: 2, messageText: "Hyperlink untrusted: click here" },
                            { messageType: 2, messageText: "The Earth is round [1] and orbits the sun [2]" }
                        ],
                        messageType: 1,
                        unifiedResponse: {
                            data: Buffer.from(JSON.stringify({
                                response_id: "slime-tech-all-formats",
                                sections: [
                                    { view_model: { primitive: { text: "① GenAIMetadataTextPrimitive", __typename: "GenAIMetadataTextPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { text: `② *GenAIMarkdownTextUXPrimitive*\n- bold\n- list\n=={highlight}==`, __typename: "GenAIMarkdownTextUXPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { text: "③ IMAGE (imagine_type: IMAGE)", __typename: "GenAIMetadataTextPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { media: { url: "https://i.ibb.co/gFtzzS4J/file-00000000609081f99bf42f733dfa211e.png", mime_type: "image/jpeg" }, imagine_type: "IMAGE", status: { status: "READY" }, __typename: "GenAIImaginePrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { text: "④ VIDEO (imagine_type: ANIMATE)", __typename: "GenAIMetadataTextPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { media: { url: "https://files.catbox.moe/grjxo4.mp4", mime_type: "video/mp4", duration: 10 }, imagine_type: "ANIMATE", status: { status: "READY" }, __typename: "GenAIImaginePrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { text: "⑤ GenAICodeUXPrimitive", __typename: "GenAIMetadataTextPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { language: "javascript", code_blocks: [ { content: "const", type: "KEYWORD" }, { content: " brand = ", type: "DEFAULT" }, { content: "'slime Tech'", type: "STR" } ], __typename: "GenAICodeUXPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { text: "⑥ GenATableUXPrimitive", __typename: "GenAIMetadataTextPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { rows: [ { is_header: true, cells: ["Format", "Status"] }, { is_header: false, cells: ["image", "✅"] }, { is_header: false, cells: ["video", "✅"] }, { is_header: false, cells: ["code", "✅"] }, { is_header: false, cells: ["table", "✅"] } ], __typename: "GenATableUXPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { text: "⑦ GenAISearchResultPrimitive", __typename: "GenAIMetadataTextPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { sources: [{ source_type: "THIRD_PARTY", source_display_name: "Slime Tech", source_subtitle: "search", source_url: "https://vdz-zone-bots.xo.je", favicon: { url: "https://i.ibb.co/C5DSpKzg/e16b25df8f24674354595f39199a7f45.jpg", mime_type: "image/jpeg", width: 16, height: 16 } }], __typename: "GenAISearchResultPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { text: "⑧ GenAIProductItemCardPrimitive (single)", __typename: "GenAIMetadataTextPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { title: "Slime Tech Product", brand: "Slime Tech", price: "$99.00", sale_price: "$79.00", product_url: "https://vdz-zone-bots.xo.je", image: { url: "https://i.ibb.co/C5DSpKzg/e16b25df8f24674354595f39199a7f45.jpg" }, __typename: "GenAIProductItemCardPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { text: "⑨ GenAIProductItemCardPrimitive (hscroll)", __typename: "GenAIMetadataTextPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitives: [ { title: "Product A", brand: "Slime Tech", price: "$10.00", sale_price: "$0", product_url: "https://vdz-zone-bots.xo.je", image: { url: "https://i.ibb.co/C5DSpKzg/e16b25df8f24674354595f39199a7f45.jpg" }, __typename: "GenAIProductItemCardPrimitive" }, { title: "Product B", brand: "Slime Tech", price: "$20.00", sale_price: "$0", product_url: "https://vdz-zone-bots.xo.je", image: { url: "https://i.ibb.co/C5DSpKzg/e16b25df8f24674354595f39199a7f45.jpg" }, __typename: "GenAIProductItemCardPrimitive" }, { title: "Product C", brand: "Slime Tech", price: "$30.00", sale_price: "$0", product_url: "https://vdz-zone-bots.xo.je", image: { url: "https://i.ibb.co/C5DSpKzg/e16b25df8f24674354595f39199a7f45.jpg" }, __typename: "GenAIProductItemCardPrimitive" } ], __typename: "GenAIHScrollLayoutViewModel" } },
                                    { view_model: { primitive: { text: "⑩ GenAIFollowUpSuggestionPillPrimitive", __typename: "GenAIMetadataTextPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitives: [ { prompt_text: "Pill A", prompt_type: "SUGGESTED_PROMPT", __typename: "GenAIFollowUpSuggestionPillPrimitive" }, { prompt_text: "Pill B", prompt_type: "SUGGESTED_PROMPT", __typename: "GenAIFollowUpSuggestionPillPrimitive" }, { prompt_text: "Pill C", prompt_type: "SUGGESTED_PROMPT", __typename: "GenAIFollowUpSuggestionPillPrimitive" } ], __typename: "GenAIActionRowLayoutViewModel" } },
                                    { view_model: { primitive: { text: "⑪ GenAIReelPrimitive (hscroll)", __typename: "GenAIMetadataTextPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitives: [ { reels_url: "https://vdz-zone-bots.xo.je", thumbnail_url: "https://i.ibb.co/gFtzzS4J/file-00000000609081f99bf42f733dfa211e.png", creator: "slimeTech", avatar_url: "https://i.ibb.co/gFtzzS4J/file-00000000609081f99bf42f733dfa211e.png", reels_title: "slime Tech Reel", likes_count: 999, shares_count: 99, view_count: 9999, reel_source: "IG", is_verified: true, __typename: "GenAIReelPrimitive" }, { reels_url: "https://vdz-zone-bots.xo.je", thumbnail_url: "https://i.ibb.co/gFtzzS4J/file-00000000609081f99bf42f733dfa211e.png", creator: "slimeTech", avatar_url: "https://i.ibb.co/gFtzzS4J/file-00000000609081f99bf42f733dfa211e.png", reels_title: "slime Tech Reel 2", likes_count: 999, shares_count: 99, view_count: 9999, reel_source: "IG", is_verified: false, __typename: "GenAIReelPrimitive" } ], __typename: "GenAIHScrollLayoutViewModel" } },
                                    { view_model: { primitive: { text: "⑫ GenAIPostPrimitive (hscroll)", __typename: "GenAIMetadataTextPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitives: [ { title: "Slime Tech Post", subtitle: "sub", username: "slimetech", profile_picture_url: "https://i.ibb.co/gFtzzS4J/file-00000000609081f99bf42f733dfa211e.png", is_verified: true, thumbnail_url: "https://i.ibb.co/gFtzzS4J/file-00000000609081f99bf42f733dfa211e.png", post_caption: "Slime Tech caption", likes_count: 1, comments_count: 1, shares_count: 1, post_url: "https://vdz-zone-bots.xo.je", post_deeplink: "https://vdz-zone-bots.xo.je", source_app: "INSTAGRAM", footer_label: "IG", footer_icon: "https://i.ibb.co/gFtzzS4J/file-00000000609081f99bf42f733dfa211e.png", is_carousel: false, orientation: "PORTRAIT", post_type: "PHOTO", __typename: "GenAIPostPrimitive" } ], __typename: "GenAIHScrollLayoutViewModel" } },
                                    { view_model: { primitive: { text: "⑬ Hyperlink trusted = true\n{{IE_0}}click here (trusted){{/IE_0}}", inline_entities: [{ key: "IE_0", metadata: { display_name: "click here (trusted)", is_trusted: true, url: "https://vdz-zone-bots.xo.je", __typename: "GenAIInlineLinkItem" } }], __typename: "GenAIMarkdownTextUXPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { text: "⑭ Hyperlink trusted = false\n{{IE_1}}click here (untrusted){{/IE_1}}", inline_entities: [{ key: "IE_1", metadata: { display_name: "click here (untrusted)", is_trusted: false, url: "https://vdz-zone-bots.xo.je", __typename: "GenAIInlineLinkItem" } }], __typename: "GenAIMarkdownTextUXPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { text: "⑮ Citation\nThe Earth is round {{IE_2}}[1]{{/IE_2}} and orbits the sun {{IE_3}}[2]{{/IE_3}}", inline_entities: [ { key: "IE_2", metadata: { reference_id: 1, reference_url: "https://vdz-zone-bots.xo.je", reference_title: "NASA - Earth", reference_display_name: "vdz-zone-bots.xo.je", sources: [{ source_type: "THIRD_PARTY", source_display_name: "vdz-zone-bots.xo.je", source_subtitle: "NASA - Earth", source_url: "https://vdz-zone-bots.xo.je", favicon: { url: "https://i.ibb.co/C5DSpKzg/e16b25df8f24674354595f39199a7f45.jpg", width: 80, height: 80 } }], __typename: "GenAISearchCitationItem" } }, { key: "IE_3", metadata: { reference_id: 2, reference_url: "https://vdz-zone-bots.xo.je", reference_title: "Wikipedia", reference_display_name: "vdz-zone-bots.xo.je", sources: [{ source_type: "THIRD_PARTY", source_display_name: "vdz-zone-bots.xo.je", source_subtitle: "Wikipedia", source_url: "https://vdz-zone-bots.xo.je", favicon: { url: "https://i.ibb.co/C5DSpKzg/e16b25df8f24674354595f39199a7f45.jpg", width: 80, height: 80 } }], __typename: "GenAISearchCitationItem" } } ], __typename: "GenAIMarkdownTextUXPrimitive" }, __typename: "GenAISingleLayoutViewModel" } },
                                    { view_model: { primitive: { sources: [ { source_type: "THIRD_PARTY", source_display_name: "NASA - Earth", source_subtitle: "vdz-zone-bots.xo.je", source_url: "https://vdz-zone-bots.xo.je", favicon: { url: "https://i.ibb.co/C5DSpKzg/e16b25df8f24674354595f39199a7f45.jpg", width: 80, height: 80 } }, { source_type: "THIRD_PARTY", source_display_name: "Wikipedia", source_subtitle: "vdz-zone-bots.xo.je", source_url: "https://vdz-zone-bots.xo.je", favicon: { url: "https://i.ibb.co/C5DSpKzg/e16b25df8f24674354595f39199a7f45.jpg", width: 80, height: 80 } } ], search_engine: "MASE", __typename: "GenAISearchResultPrimitive" }, __typename: "GenAISingleLayoutViewModel" } }
                                ]
                            })).toString('base64')
                        },
                        contextInfo: {
                            mentionedJid: [], 
                            groupMentions: [], 
                            statusAttributions: [],
                            stanzaId: message.key.id,
                            participant: sender,
                            remoteJid: chat,
                            forwardingScore: 1, 
                            isForwarded: true,
                            forwardedAiBotMessageInfo: { botJid: "0@bot" },
                            forwardOrigin: 4
                        }
                    }
                }
            }
        }, {});
    } catch (e) {
        console.error(e);
        await client.sendMessage(chat, { text: `❌ Erreur Rich AI:\n\n${e.message}` }, { quoted: message });
    }
}

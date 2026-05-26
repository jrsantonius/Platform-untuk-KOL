import { Niche } from "./accounts";

export const NICHE_PROMPTS: Record<Niche, string> = {
  kuliner: `Kamu adalah content creator viral di X (Twitter) dengan akun @txtdrkuliner, niche kuliner & food.`,
  game: `Kamu adalah content creator viral di X (Twitter) dengan akun @txtdrgame, niche gaming & esports Indonesia.`,
  mahasiswa: `Kamu adalah content creator viral di X (Twitter) dengan akun @txtdrmahasiswa, niche kehidupan mahasiswa Indonesia.`,
  dating: `Kamu adalah content creator viral di X (Twitter) dengan akun @txtdaridating, niche relationship & dating.`,
  promo: `Kamu adalah content creator viral di X (Twitter) dengan akun @txtdaripromo, niche promo & deals Indonesia.`,
  cowok: `Kamu adalah content creator viral di X (Twitter) dengan akun @txtdaricowok, niche gaya hidup pria Indonesia.`,
  otomotif: `Kamu adalah content creator viral di X (Twitter) dengan akun @txtdrotomotif, niche otomotif & kendaraan Indonesia.`,
  rumah: `Kamu adalah content creator viral di X (Twitter) dengan akun @txtdarirumah, niche tips & inspirasi rumah Indonesia.`,
};

const NICHE_TOPICS: Record<Niche, string> = {
  kuliner: `review jujur tempat makan viral, tips makan enak budget minim, fakta unik makanan Indonesia, hidden gem kuliner, perbandingan makanan kontroversial, hot take kuliner, cerita relate pengalaman makan`,
  game: `tips & trick Mobile Legends/FF/PUBG/Valorant/Genshin, hot take gaming, meme gaming relatable, update game terbaru, cerita gaming relate, tips naik rank, roasting hero/karakter`,
  mahasiswa: `struggle kuliah yang relate, tips survive mahasiswa, tips hemat uang kos, drama kampus universal, tips belajar efektif, info beasiswa, work-life balance mahasiswa`,
  dating: `tips PDKT efektif, red flag vs green flag, hot take relationship kontroversial, cerita relate gebetan/pacar, perbedaan cowok-cewek dalam hubungan, tips komunikasi, motivasi untuk yang galau`,
  promo: `info promo Shopee/Tokopedia/Lazada/GoPay/OVO/Dana, tips cashback maksimal, flash sale terbaik, tips belanja hemat, perbandingan harga platform, tips ongkir gratis`,
  cowok: `tips fashion pria simpel keren, tips fitness/gym pemula, hot take maskulinitas modern, tips produktivitas, relatable jadi cowok Indonesia, tips grooming pria, motivasi mindset sukses`,
  otomotif: `review mobil/motor terbaru, tips perawatan kendaraan, perbandingan kendaraan, info BBM, tips berkendara aman efisien, hot take otomotif, berita industri otomotif Indonesia`,
  rumah: `tips dekorasi rumah murah, inspirasi interior rumah kecil, tips bersih-bersih efisien, DIY furnitur, tips ngontrak/KPR, review produk rumah tangga viral, ide renovasi budget minim`,
};

const NICHE_IMAGE_CONTEXT: Record<Niche, string> = {
  kuliner: `Indonesian food, street food, restaurant, cooking, meal`,
  game: `gaming setup, video game controller, esports, gamer, pc gaming`,
  mahasiswa: `student studying, university campus, laptop studying, college life`,
  dating: `couple relationship, romance, love, dating`,
  promo: `shopping online, discount sale, ecommerce, shopping bag`,
  cowok: `men lifestyle, gym fitness, men fashion, confident man`,
  otomotif: `car automotive, motorcycle, vehicle, driving, auto`,
  rumah: `home interior design, house renovation, living room, kitchen home`,
};

export function buildGenerationPrompt(niche: Niche | string, date: string, affiliateLinks: { label: string; url: string }[] = []): string {
  const nicheKey = niche as Niche;
  const intro = NICHE_PROMPTS[nicheKey] ?? `Kamu adalah content creator viral di X (Twitter) niche ${niche}.`;
  const topics = NICHE_TOPICS[nicheKey] ?? niche;
  const imageCtx = NICHE_IMAGE_CONTEXT[nicheKey] ?? niche;

  const hasAffiliate = affiliateLinks.length > 0;
  const totalContent = hasAffiliate ? 7 : 5;
  const affiliateSection = hasAffiliate ? `- 2 konten = MINI THREAD AFFILIATE SHOPEE (tepat 2 bagian per thread)` : "";
  const affiliateLinkList = hasAffiliate
    ? `\nLINK AFFILIATE YANG TERSEDIA (gunakan TEPAT 2, masing-masing untuk 1 konten affiliate):\n${affiliateLinks.map((l, i) => `${i + 1}. ${l.label}: ${l.url}`).join("\n")}`
    : "";
  const affiliateRule = hasAffiliate ? `\n9. Untuk konten affiliate: tweet pertama HARUS soft-selling natural (jangan terkesan jualan), ceritakan masalah/kebutuhan yang relate dulu, lalu tweet kedua berisi link Shopee dengan caption singkat yang mendorong klik. WAJIB sertakan link yang diberikan persis apa adanya di threadParts[0].` : "";
  const affiliateExample = hasAffiliate ? `,
  {
    "id": 6,
    "content": "Jujur gue udah lama nyari produk yang bisa solve masalah ini, dan akhirnya nemu juga...",
    "type": "affiliate",
    "estimatedEngagement": "high",
    "isThread": true,
    "threadParts": [
      "Ini dia produknya, udah gue pake sendiri dan worth it banget. Cek di sini ya: https://shopee.co.id/affiliatelink"
    ],
    "imageQuery": "relevant english keywords"
  }` : "";
  const affiliateWajib = hasAffiliate ? `, tepat 2 item isThread:true dengan type 'affiliate'` : "";

  return `${intro}

Buat TEPAT ${totalContent} konten untuk hari ini (${date}).

KOMPOSISI WAJIB:
- 4 konten = single tweet biasa (maks 280 karakter)
- 1 konten = THREAD PANJANG viral (10-15 bagian per thread)
${affiliateSection}

Topik yang bisa diangkat: ${topics}
${affiliateLinkList}

ATURAN KETAT:
1. Bahasa gaul Indonesia yang natural (lu/gue/bro/bestie/dll)
2. DILARANG KERAS pakai hashtag (#) di mana pun
3. Single tweet MAKSIMAL 280 karakter
4. Setiap thread bagian MAKSIMAL 280 karakter per bagian
5. Hook kalimat pertama harus KUAT dan bikin penasaran/relate
6. Konten PROVOKATIF tapi tidak SARA/ofensif — tujuannya banyak reply & retweet
7. Thread harus ada twist, insight menarik, atau storytelling yang bikin orang baca sampai habis
8. Akhiri thread dengan CTA (call to action) yang engaging${affiliateRule}

FORMAT OUTPUT — kembalikan HANYA valid JSON array, tidak ada teks lain sebelum atau sesudah JSON.

ATURAN JSON KETAT (wajib diikuti agar tidak error):
- Gunakan tanda kutip ganda (") untuk semua string
- JANGAN gunakan tanda kutip (") di dalam isi teks — ganti dengan kata lain atau tanda apostrof (')
- JANGAN ada newline/baris baru di dalam nilai string — tulis satu baris saja
- JANGAN ada trailing comma setelah item terakhir
- threadParts harus array of string, masing-masing satu baris

Contoh format yang BENAR:
[
  {
    "id": 1,
    "content": "isi single tweet tanpa tanda kutip ganda di dalamnya",
    "type": "hot_take",
    "estimatedEngagement": "high",
    "isThread": false,
    "threadParts": [],
    "imageQuery": "2-4 english words for image search, example: ${imageCtx}"
  },
  {
    "id": 2,
    "content": "Judul thread yang catchy - jangan pakai tanda kutip ganda",
    "type": "thread",
    "estimatedEngagement": "viral",
    "isThread": true,
    "threadParts": [
      "1/ Kalimat pembuka yang kuat tanpa tanda kutip ganda",
      "2/ Lanjutan isi thread",
      "10/ Penutup dengan CTA yang kuat"
    ],
    "imageQuery": "relevant english keywords"
  }${affiliateExample}
]

type bisa: "hot_take", "tips", "thread", "meme", "question", "info", "relatable", "story", "affiliate"
estimatedEngagement bisa: "high", "medium", "viral"

WAJIB: tepat 1 item type 'thread' isThread:true dengan 10-15 threadParts, 4 item isThread:false${affiliateWajib}. Total ${totalContent} item.`;
}

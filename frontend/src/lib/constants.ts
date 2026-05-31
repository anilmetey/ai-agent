import { ModeConfig } from "@/types";

export const ANALYSIS_MODES: ModeConfig[] = [
  {
    id: "genel",
    label: "Genel Analiz",
    icon: "🔍",
    description: "Genel görsel analizi",
    prompt:
      "Bu görseli detaylı analiz et. Ne görüyorsun, ne anlıyorsun, önemli unsurları ve genel değerlendirmeni paylaş.",
  },
  {
    id: "dekorasyon",
    label: "Dekorasyon",
    icon: "🛋️",
    description: "İç mekan & dekorasyon önerileri",
    prompt:
      "Bu oda/mekan fotoğrafını dekorasyon uzmanı gözüyle analiz et. Mevcut stil, renk paleti, güçlü yönler ve somut iyileştirme önerileri ver.",
  },
  {
    id: "kod",
    label: "Kod Analizi",
    icon: "💻",
    description: "Kod & hata analizi",
    prompt:
      "Bu ekran görüntüsündeki kodu veya hata mesajını analiz et. Olası hataları, iyileştirme önerilerini ve en iyi pratikleri açıkla.",
  },
  {
    id: "stil",
    label: "Stil",
    icon: "👗",
    description: "Kıyafet & style değerlendirme",
    prompt:
      "Bu kıyafet/style fotoğrafını moda uzmanı gözüyle değerlendir. Renk kombinasyonu, uyum, trend analizi ve styling önerileri ver.",
  },
  {
    id: "yemek",
    label: "Yemek",
    icon: "🍽️",
    description: "Tarif & besin analizi",
    prompt:
      "Bu yemek fotoğrafını analiz et. Olası tarif tahmini, malzemeler, yaklaşık besin değerleri ve sunum önerileri ver.",
  },
  {
    id: "yaratici",
    label: "Yaratıcı",
    icon: "✨",
    description: "Sanatsal & yaratıcı yorum",
    prompt:
      "Bu görseli yaratıcı ve ilham verici bir şekilde yorumla. Sanat analizi, hikaye anlatımı veya poetik bir değerlendirme yapabilirsin.",
  },
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

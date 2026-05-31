# ✦ LuminaAI

Görsel yükle → AI anlık analiz etsin. Dekorasyon, kod, stil, yemek ve daha fazlası.

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 15 + TypeScript + Tailwind |
| Backend | Python + FastAPI |
| AI | Anthropic Claude (Vision) |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## 🚀 Kurulum

### 1. Repoyu klonla

```bash
git clone https://github.com/siz/luminaai.git
cd luminaai
```

---

### 2. Backend

```bash
cd backend

# .env oluştur
cp .env.example .env
# .env içine ANTHROPIC_API_KEY'ini yaz

# Sanal ortam kur
python -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows

# Bağımlılıkları yükle
pip install -r requirements.txt

# Çalıştır
uvicorn app.main:app --reload --port 8000
```

Backend → `http://localhost:8000`  
API Docs → `http://localhost:8000/docs`

---

### 3. Frontend

```bash
cd frontend

# .env oluştur
cp .env.example .env.local
# .env.local içinde NEXT_PUBLIC_API_URL=http://localhost:8000

# Bağımlılıkları yükle
npm install

# Çalıştır
npm run dev
```

Frontend → `http://localhost:3000`

---

## 📁 Proje Yapısı

```
luminaai/
├── backend/
│   ├── app/
│   │   └── main.py          # FastAPI app, /analyze endpoint
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx     # Ana sayfa
│   │   │   ├── layout.tsx   # Root layout + fontlar
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ModeSelector.tsx    # Analiz modu seçici
│   │   │   ├── DropZone.tsx        # Drag & drop yükleme
│   │   │   ├── AnalysisResult.tsx  # Markdown sonuç gösterimi
│   │   │   └── HistoryPanel.tsx    # Analiz geçmişi
│   │   ├── lib/
│   │   │   ├── constants.ts  # Modlar ve ayarlar
│   │   │   ├── api.ts        # Backend API çağrıları
│   │   │   └── useLumina.ts  # Ana state management hook
│   │   └── types/
│   │       └── index.ts      # TypeScript tipleri
│   ├── package.json
│   ├── tailwind.config.ts
│   └── .env.example
│
└── docker-compose.yml
```

---

## 🔌 API Endpoints

| Method | Path | Açıklama |
|--------|------|----------|
| GET | `/` | Servis durumu |
| GET | `/health` | Health check |
| GET | `/modes` | Mevcut analiz modları |
| POST | `/analyze` | Görsel analizi (tam yanıt) |
| POST | `/analyze/stream` | Görsel analizi (streaming SSE) |

### POST /analyze/stream — Request Body

```json
{
  "image_base64": "base64_encoded_image_data",
  "media_type": "image/jpeg",
  "mode": "genel",
  "custom_prompt": "Opsiyonel ek soru"
}
```

**Modlar:** `genel` · `dekorasyon` · `kod` · `stil` · `yemek` · `yaratici`

---

## 🚢 Deployment

### Backend → Railway

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. `backend/` klasörünü seç
3. Environment Variables ekle:
   - `ANTHROPIC_API_KEY=sk-ant-...`
   - `FRONTEND_URL=https://luminaai.vercel.app`
4. Deploy — Railway otomatik Dockerfile kullanır

### Frontend → Vercel

1. [vercel.com](https://vercel.com) → New Project → GitHub repo
2. Root Directory: `frontend`
3. Environment Variables ekle:
   - `NEXT_PUBLIC_API_URL=https://luminaai-backend.railway.app`
4. Deploy

---

## 🐳 Docker ile Lokal Çalıştırma

```bash
# .env dosyasını root'a koy
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env

docker-compose up --build
```

---

## Geliştirme Yol Haritası

- [ ] Supabase ile analiz geçmişi persist etme
- [ ] Paylaşılabilir sonuç linkleri
- [ ] Toplu görsel analizi
- [ ] PDF rapor indirme
- [ ] Kullanıcı hesabı (Auth)

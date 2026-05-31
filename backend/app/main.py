import os
import base64
import uuid
from datetime import datetime
from typing import Optional

import anthropic
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

app = FastAPI(title="PamukAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", os.getenv("FRONTEND_URL", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

ANALYSIS_MODES = {
    "genel": "Bu görseli detaylı analiz et. Ne görüyorsun, ne anlıyorsun, önemli unsurları ve genel değerlendirmeni paylaş.",
    "dekorasyon": "Bu oda/mekan fotoğrafını dekorasyon uzmanı gözüyle analiz et. Mevcut stil, renk paleti, güçlü yönler ve somut iyileştirme önerileri ver.",
    "kod": "Bu ekran görüntüsündeki kodu veya hata mesajını analiz et. Olası hataları, iyileştirme önerilerini ve en iyi pratikleri açıkla.",
    "stil": "Bu kıyafet/style fotoğrafını moda uzmanı gözüyle değerlendir. Renk kombinasyonu, uyum, trend analizi ve styling önerileri ver.",
    "yemek": "Bu yemek fotoğrafını analiz et. Olası tarif tahmini, malzemeler, yaklaşık besin değerleri ve sunum önerileri ver.",
    "yaratici": "Bu görseli yaratıcı ve ilham verici bir şekilde yorumla. Sanat analizi, hikaye anlatımı veya poetik bir değerlendirme yapabilirsin.",
}

SYSTEM_PROMPT = """Sen PamukAI'sin — görsel analiz konusunda uzman, zeki ve yaratıcı bir AI asistansın.
Analizlerini Türkçe yaparsın. Cevaplarında:
- Net başlıklar (## ile) kullan
- Bullet point listeler ekle
- Pratik ve actionable öneriler ver
- Emoji ile renklendirme yapabilirsin ama aşırıya kaçma
- Her zaman pozitif ama dürüst ol"""


class AnalyzeRequest(BaseModel):
    image_base64: str
    media_type: str = "image/jpeg"
    mode: str = "genel"
    custom_prompt: Optional[str] = None


class AnalyzeResponse(BaseModel):
    id: str
    result: str
    mode: str
    timestamp: str


@app.get("/")
async def root():
    return {"status": "ok", "service": "PamukAI API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_image(req: AnalyzeRequest):
    """Analyze image with Claude Vision - returns full response"""
    if req.mode not in ANALYSIS_MODES:
        raise HTTPException(status_code=400, detail=f"Geçersiz mod. Geçerli modlar: {list(ANALYSIS_MODES.keys())}")

    try:
        base64.b64decode(req.image_base64)
    except Exception:
        raise HTTPException(status_code=400, detail="Geçersiz base64 görsel verisi")

    prompt = ANALYSIS_MODES[req.mode]
    if req.custom_prompt:
        prompt += f"\n\nEk soru/istek: {req.custom_prompt}"

    try:
        message = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": req.media_type,
                                "data": req.image_base64,
                            },
                        },
                        {"type": "text", "text": prompt},
                    ],
                }
            ],
        )

        result_text = message.content[0].text

        return AnalyzeResponse(
            id=str(uuid.uuid4()),
            result=result_text,
            mode=req.mode,
            timestamp=datetime.utcnow().isoformat(),
        )

    except anthropic.APIError as e:
        raise HTTPException(status_code=502, detail=f"Claude API hatası: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sunucu hatası: {str(e)}")


@app.post("/analyze/stream")
async def analyze_image_stream(req: AnalyzeRequest):
    """Analyze image with Claude Vision - streams response token by token"""
    if req.mode not in ANALYSIS_MODES:
        raise HTTPException(status_code=400, detail=f"Geçersiz mod")

    prompt = ANALYSIS_MODES[req.mode]
    if req.custom_prompt:
        prompt += f"\n\nEk soru/istek: {req.custom_prompt}"

    def generate():
        with client.messages.stream(
            model="claude-opus-4-5",
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": req.media_type,
                                "data": req.image_base64,
                            },
                        },
                        {"type": "text", "text": prompt},
                    ],
                }
            ],
        ) as stream:
            for text in stream.text_stream:
                yield f"data: {text}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/modes")
async def get_modes():
    """Return available analysis modes"""
    return {
        "modes": [
            {"id": "genel", "label": "Genel Analiz", "icon": "🔍", "description": "Genel görsel analizi"},
            {"id": "dekorasyon", "label": "Dekorasyon", "icon": "🛋️", "description": "İç mekan & dekorasyon önerileri"},
            {"id": "kod", "label": "Kod Analizi", "icon": "💻", "description": "Kod & hata analizi"},
            {"id": "stil", "label": "Stil", "icon": "👗", "description": "Kıyafet & style değerlendirme"},
            {"id": "yemek", "label": "Yemek", "icon": "🍽️", "description": "Tarif & besin analizi"},
            {"id": "yaratici", "label": "Yaratıcı", "icon": "✨", "description": "Sanatsal & yaratıcı yorum"},
        ]
    }

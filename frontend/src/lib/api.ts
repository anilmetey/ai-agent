import { AnalysisMode, AnalyzeResponse } from "@/types";
import { API_BASE_URL } from "./constants";

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix (e.g. "data:image/jpeg;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Dosya okunamadı"));
    reader.readAsDataURL(file);
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Dosya okunamadı"));
    reader.readAsDataURL(file);
  });
}

export async function analyzeImage(
  imageBase64: string,
  mediaType: string,
  mode: AnalysisMode,
  customPrompt?: string
): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_base64: imageBase64,
      media_type: mediaType,
      mode,
      custom_prompt: customPrompt || undefined,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Bilinmeyen hata" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function analyzeImageStream(
  imageBase64: string,
  mediaType: string,
  mode: AnalysisMode,
  customPrompt: string | undefined,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_base64: imageBase64,
        media_type: mediaType,
        mode,
        custom_prompt: customPrompt || undefined,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Bilinmeyen hata" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            onDone();
            return;
          }
          onChunk(data);
        }
      }
    }
    onDone();
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}

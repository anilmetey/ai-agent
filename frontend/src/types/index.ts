export type AnalysisMode = "genel" | "dekorasyon" | "kod" | "stil" | "yemek" | "yaratici";

export interface ModeConfig {
  id: AnalysisMode;
  label: string;
  icon: string;
  description: string;
  prompt: string;
}

export interface AnalysisResult {
  id: string;
  mode: AnalysisMode;
  modeLabel: string;
  result: string;
  thumbnail: string;
  timestamp: Date;
  customPrompt?: string;
}

export interface AnalyzeRequest {
  image_base64: string;
  media_type: string;
  mode: AnalysisMode;
  custom_prompt?: string;
}

export interface AnalyzeResponse {
  id: string;
  result: string;
  mode: string;
  timestamp: string;
}

export type AnalysisStatus = "idle" | "uploading" | "analyzing" | "done" | "error";

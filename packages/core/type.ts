import { ClaudeRequestOptions, OpenAIRequestOptions } from "./providers";

export interface ProviderConfig {
  apiKey: string;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// 通用请求选项类型
export type RequestOptions = OpenAIRequestOptions | ClaudeRequestOptions;

// 定义回调函数类型
export interface Callbacks {
  onMessage?: (chunk: string) => void;
  onError?: (error: Error) => void;
  onFinish?: (data: FinishData) => void;
}

export interface FinishData {
  usage?: Usage | null;
}

export type Role = "system" | "user" | "assistant";

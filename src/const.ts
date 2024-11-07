import { ClaudeModelEnum, GeminiModelEnum, LlamaModelEnum, OpenAIModelEnum, ProviderEnum } from "./enum";

// TODO：这只是示例，具体需要去官网根据实际情况调整下面的数值
export const OpenAIMaxToken: Record<OpenAIModelEnum, number> = {
  [OpenAIModelEnum.GPT4O]: 4096,
  [OpenAIModelEnum.GPT4OMini]: 16384,
  [OpenAIModelEnum.GPT4Turbo]: 4096,
  [OpenAIModelEnum.GPT4]: 8192,
  [OpenAIModelEnum.GPT35Turbo]: 4096,
  [OpenAIModelEnum.O1Mini]: 65536,
  [OpenAIModelEnum.O1Preview]: 32768,
};

// TODO：这只是示例，具体需要去官网根据实际情况调整下面的数值
export const ClaudeMaxToken: Record<ClaudeModelEnum, number> = {
  [ClaudeModelEnum.Claude35Sonnet20240620]: 8192,
  [ClaudeModelEnum.Claude3Haiku20240307]: 4096,
  [ClaudeModelEnum.Claude3Opus20240229]: 4096,
  [ClaudeModelEnum.Claude3Sonnet20240229]: 4096,
}

// TODO：这只是示例，具体需要去官网根据实际情况调整下面的数值
export const GeminiMaxToken: Record<GeminiModelEnum, number> = {
  [GeminiModelEnum.Gemini10Pro]: 8192,
  [GeminiModelEnum.Gemini15Flash]: 8192,
  [GeminiModelEnum.Gemini15Pro]: 8192,
}

// TODO：这只是示例，具体需要去官网根据实际情况调整下面的数值
export const LlamaMaxToken: Record<LlamaModelEnum, number> = {
  [LlamaModelEnum.Llama31_405b]: 4096,
  [LlamaModelEnum.Llama31_70b]: 4096,
  [LlamaModelEnum.Llama31_8b]: 2048,
  [LlamaModelEnum.Llama32_1b]: 2048,
  [LlamaModelEnum.Llama32_3b]: 4096,
}

export const ProviderMaxToken: Record<ProviderEnum, Record<string, number>> = {
  [ProviderEnum.OpenAI]: OpenAIMaxToken,
  [ProviderEnum.Claude]: ClaudeMaxToken,
  [ProviderEnum.Gemini]: GeminiMaxToken,
  [ProviderEnum.Llama]: LlamaMaxToken,
};
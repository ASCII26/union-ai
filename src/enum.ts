export enum ProviderEnum {
  OpenAI = 'OpenAI',
  Claude = 'Claude',
  Gemini = 'Gemini',
  Llama = 'Llama',
}
// TODO：这只是示例，具体需要去官网根据实际情况调整下面的枚举值
export enum OpenAIModelEnum {
  GPT4 = 'gpt-4',
  GPT4Turbo = 'gpt-4-turbo',
  GPT4OMini = 'gpt-4o-mini',
  GPT4O = 'gpt-4o',
  O1Mini = 'o1-mini',
  O1Preview = 'o1-preview',
  GPT35Turbo = 'gpt-3.5-turbo',
}

// TODO：这只是示例，具体需要去官网根据实际情况调整下面的枚举值
export enum ClaudeModelEnum {
  Claude35Sonnet20240620 = 'claude-3-5-sonnet-20240620',
  Claude3Opus20240229 = 'claude-3-opus-20240229',
  Claude3Sonnet20240229 = 'claud-3-sonnet-20240229',
  Claude3Haiku20240307 = 'claude-3-haiku-20240307',
}

// TODO：这只是示例，具体需要去官网根据实际情况调整下面的枚举值
export enum GeminiModelEnum {
  Gemini15Flash = 'gemini-1.5-flash',
  Gemini15Pro = 'gemini-1.5-pro',
  Gemini10Pro = 'gemini-1.0-pro',
}
// TODO：这只是示例，具体需要去官网根据实际情况调整下面的枚举值
export enum LlamaModelEnum {
  Llama31_405b = 'llama3.1-405b',
  Llama31_70b = 'llama3.1-70b',
  Llama31_8b = 'llama3.1-8b',
  Llama32_1b = 'llama3.2-1b',
  Llama32_3b = 'llama3.2-3b',
}
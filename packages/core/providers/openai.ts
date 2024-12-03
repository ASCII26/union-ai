import OpenAI from "openai";
import { AIProviderAdapter } from "../adapter";
import { Role, ProviderConfig, Callbacks, Usage } from "../type";

export type OpenAIModel =
  | (string & {})
  | "gpt-4"
  | "gpt-4-turbo"
  | "gpt-4o-mini"
  | "gpt-4o"
  | "o1-mini"
  | "o1-preview"
  | "gpt-3.5-turbo";

export interface OpenAIRequestOptions {
  model: OpenAIModel;
  messages: Array<{ role: Role; content: string }>;
}

export class OpenAIAdapter extends AIProviderAdapter {
  private openai: OpenAI;

  constructor(config: ProviderConfig) {
    super(config);
    this.openai = new OpenAI({
      apiKey: this.config.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async sendRequest(
    { model, messages }: OpenAIRequestOptions,
    { onMessage, onError, onFinish }: Callbacks
  ): Promise<void> {
    try {
      const responseStream = await this.openai.chat.completions.create({
        model,
        messages,
        stream: true,
        stream_options: {
          include_usage: true,
        },
      });

      let usage: Usage | null | undefined = null;
      for await (const chunk of responseStream) {
        const content = chunk.choices[0]?.delta?.content || "";
        usage = chunk.usage;
        if (content) {
          onMessage?.(content);
        }
      }
      onFinish?.({ usage });
    } catch (error) {
      onError?.(error as Error);
    }
  }
}

import Anthropic from "@anthropic-ai/sdk";
import { MessageParam, Model } from "@anthropic-ai/sdk/resources/messages.mjs";
import { AIProviderAdapter } from "../adapter";
import { ProviderConfig, Callbacks } from "../type";


export type ClaudeModel = Model;
export interface ClaudeRequestOptions {
  model: Model;
  messages: MessageParam[];
}

export class ClaudeAdapter extends AIProviderAdapter {
  private anthropic: Anthropic;

  constructor(config: ProviderConfig) {
    super(config);
    this.anthropic = new Anthropic({
      apiKey: this.config.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async sendRequest(
    { model, messages }: ClaudeRequestOptions,
    { onMessage, onError, onFinish }: Callbacks
  ): Promise<void> {
    try {
      const streamInstance = this.anthropic.messages.stream({
        model,
        // TODO: 请在此处填写 max_tokens 参数
        max_tokens: 4096,
        messages,
        stream: true,
      });
      const responseStream = streamInstance.on("text", async (text) => {
        if (text) {
          onMessage?.(text);
        }
      });

      streamInstance.on("end", async () => {
        const message = await responseStream.finalMessage();
        const { input_tokens, output_tokens } = message.usage;
        onFinish?.({
          usage: {
            completion_tokens: output_tokens,
            prompt_tokens: input_tokens,
            total_tokens: input_tokens + output_tokens,
          },
        });
      });
    } catch (error) {
      onError?.(error as Error);
    }
  }
}

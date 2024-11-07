import { ClaudeModelEnum, GeminiModelEnum, LlamaModelEnum, OpenAIModelEnum } from "@/src/enum";

export interface Usage {
    /**
     * Number of tokens in the generated completion.
     */
    completion_tokens: number;
    /**
     * Number of tokens in the prompt.
     */
    prompt_tokens: number;

    /**
     * Total number of tokens used in the request (prompt + completion).
     */
    total_tokens: number;
}

export type ModelKey = OpenAIModelEnum | ClaudeModelEnum | GeminiModelEnum | LlamaModelEnum;
export interface ProviderConfig {
    /**
     * The model to use for the request.
     */
    model: ModelKey;
    /**
     * The API key to use for the request.
     */
    apiKey: string;
    /**
     * The messages to send to the provider.
     */
    messages: any;
    /**
     * The maximum number of tokens to use in the request.
     * if you want to use the default maxTokens, you can set it to undefined
     */
    maxTokens?: number;
    /**
     * A callback function to handle the data returned by the provider.
     */
    onData: (content: Object) => Promise<void>;
    /**
     * A callback function to call when the request is complete.
     */
    onDone: () => void;
}
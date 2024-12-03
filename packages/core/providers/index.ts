import { ClaudeModel } from "./claude";
import { OpenAIModel } from "./openai";

export * from "./openai";
export * from "./claude";
export * from "./enum";

export type Model = ClaudeModel | OpenAIModel;

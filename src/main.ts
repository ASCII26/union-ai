import { Claude } from "@/src/models/Claude/index";
import { OpenAI } from "@/src/models/OpenAI/index";
import { Llama } from "@/src/models/Llama/index";
import { Gemini } from "@/src/models/Gemini/index";
import { ProviderConfig } from "@/types";
import { ProviderEnum } from "./enum";

export const unionAI = (provider: ProviderEnum, conf: ProviderConfig) => {
  switch (provider) {
    case 'OpenAI':
      return OpenAI(conf);
    case 'Claude':
      return Claude(conf);
    case 'Gemini':
      return Gemini(conf);
    case 'Llama':
      return Llama(conf);
    default:
      throw new Error('Provider not supported');
  }
}
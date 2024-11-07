import { ProviderConfig } from "@/types";
import { ProviderEnum } from "./enum";
import UnionAI from '@/src/models/index'

const OpenAI = (conf: ProviderConfig) => new UnionAI(ProviderEnum.OpenAI, conf);
const Claude = (conf: ProviderConfig) => new UnionAI(ProviderEnum.Claude, conf);
const Gemini = (conf: ProviderConfig) => new UnionAI(ProviderEnum.Gemini, conf);
const Llama = (conf: ProviderConfig) => new UnionAI(ProviderEnum.Llama, conf);

export {
  OpenAI,
  Claude,
  Gemini,
  Llama
}
export default UnionAI;
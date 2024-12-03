import { Role, Usage } from "@unionai/core";
import { ProviderEnum, Model } from "@unionai/core/dist/providers";

export interface RequestMessage {
  id: string;
  type: Role;
  content: string;
  usage?: Usage | null;
}

export interface Provider {
  name: ProviderEnum;
  model: Model;
  icon: any;
}

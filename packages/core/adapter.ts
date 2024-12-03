import { Callbacks, ProviderConfig, RequestOptions } from "./type";

// 抽象的 Adapter 基类
export abstract class AIProviderAdapter {
  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  abstract sendRequest(
    options: RequestOptions,
    callbacks: Callbacks
  ): Promise<void>;
}

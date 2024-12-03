import { AIProviderAdapter } from "./adapter";
import { OpenAIAdapter, ClaudeAdapter } from "./providers";
import { Callbacks, ProviderConfig, RequestOptions } from "./type";
import { ProviderEnum } from "./providers/enum";

interface Config {
  openai?: ProviderConfig;
  claude?: ProviderConfig;
}

type providersMap = Record<ProviderEnum, AIProviderAdapter>;
export class UnionAI {
  [key: string]: any;
  private config: Config;
  private providers: providersMap;

  constructor(config: Config) {
    this.config = config;
    this.providers = {} as providersMap;
    this.initializeProviders();
  }

  private initializeProviders(): void {
    const availableAdapters: Record<
      ProviderEnum,
      new (config: ProviderConfig) => AIProviderAdapter
    > = {
      [ProviderEnum.OpenAI]: OpenAIAdapter,
      [ProviderEnum.Claude]: ClaudeAdapter,
    };

    Object.keys(availableAdapters).forEach((key) => {
      const providerNameKey = key as ProviderEnum;
      const providerConfig = this.config[providerNameKey];

      if (providerConfig?.apiKey) {
        const AdapterClass = availableAdapters[providerNameKey];
        this.providers[providerNameKey] = new AdapterClass(providerConfig);

        // 动态创建快捷方法
        this[providerNameKey] = this.createProviderShortcut(providerNameKey);
      }
    });

    if (Object.keys(this.providers).length === 0) {
      throw new Error(
        "No valid providers configured. Please provide at least one provider with a valid apiKey."
      );
    }
  }

  async request(
    { provider, ...options }: { provider: ProviderEnum } & RequestOptions,
    callbacks: Callbacks
  ): Promise<void> {
    const adapter = this.providers[provider];
    if (!adapter) {
      throw new Error(`Provider "${provider}" is not supported.`);
    }

    try {
      await adapter.sendRequest(options, {
        ...callbacks,
        // 多增加一个数据处理的步骤，方便后续扩展返回值
        onMessage: (data) => {
          const resp = this.dataProcess(data);
          callbacks.onMessage?.(resp);
        },
      });
    } catch (error) {
      if (callbacks.onError) callbacks.onError(error as Error);
    }
  }

  private dataProcess(data: any) {
    // TODO: 预留好数据处理的接口
    return data;
  }

  private createProviderShortcut(provider: ProviderEnum) {
    return async (options: RequestOptions, callbacks: Callbacks) =>
      this.request({ provider, ...options }, callbacks);
  }
}

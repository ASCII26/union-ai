import { ProviderConfig } from "@/types";
import { ProviderEnum } from "../enum";

class UnionAI {
  constructor(provider: ProviderEnum, conf: ProviderConfig) {}
  async completions() {
    const checkResult = await this.checkBeforeChat(c);
    if (checkResult.code !== ERetCode.SUCCESS) {
      throw new HTTPException(EStatusCode.FORBIDDEN, {
        message: checkResult.error,
        cause: checkResult.code,
      });
    }

    if (!c.var.user?.id) {
      throw new HTTPException(EStatusCode.UNAUTHORIZED, {
        message: 'Unauthorized',
      });
    }

    const { provider, model, messages, userId, type = ECompletionType.TEXT } = await c.req.json();
    const startTime = new Date().toISOString();
    const { accountId, useOwnKey } = checkResult.data!;

    if (!userId) {
      throw new HTTPException(EStatusCode.PARAMS_ERROR, {
        message: 'Missing user id',
      });
    }

    if (!provider || !model) {
      throw new HTTPException(EStatusCode.PARAMS_ERROR, {
        message: 'Missing provider or model',
      });
    }

    // 创建一个可读流，用于向客户端发送数据
    const stream = new ReadableStream({
      start: async (controller) => {
        // 使用 TextEncoder 将文本转换为字节流
        const encoder = new TextEncoder()
        try {
          const maxTokens = getMaxTokens(provider, model);
          // 选择AI输出方式
          const usageInfo = await selectAIStream({
            provider,
            model,
            apiKey: checkResult.data?.apiKey,
            messages,
            maxTokens,
            onData: async (content: Object) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(content)}\n\n`))
              // 等一会儿，不然数据发送太快了，体验不舒服
              await new Promise(resolve => setTimeout(resolve, 50));
            },
            // 在流结束时发送 [DONE] 标记
            onDone: () => controller.enqueue(encoder.encode(`data: [DONE]\n\n`)),
          })

          // 会话结束后的逻辑
          await this.completionFinish(c, {
            userId,
            type,
            provider,
            model,
            startTime,
            useOwnKey,
            accountId,
            usageInfo,
          });
        } catch (error: any) {
          console.log('====openai request error=====', error);
          zError(c, error, userId);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            error: `An error occurred while request openai: ${error.message}`,
            code: ERetCode.OPENAI_ERROR,
          })}\n\n`));
        } finally {
          // 确保流总是被关闭
          controller.close();
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    })
  }

  // 会话结束后的逻辑
  private async completionFinish() {
    const { userId, type, provider, model, startTime, useOwnKey, accountId, usageInfo } = data;
    // 进入消费逻辑
    if (!useOwnKey && usageInfo && accountId) {
      const { completion_tokens: completionToken, prompt_tokens: promptToken } = usageInfo;
      await this.chatService.consumption(c, {
        accountId,
        completionToken,
        promptToken,
        userId,
        type,
        provider,
        model,
        startTime,
        endTime: new Date().toISOString(),
      });
    }
  }

  private async checkBeforeChat() {
    const { apiKey, userId, provider } = await c.req.json();

    console.log('====checkBeforeChat', apiKey, userId);
    // 自带apikey的，跳过检查
    if (apiKey) {
      return {
        error: '',
        code: ERetCode.SUCCESS,
        data: { apiKey, accountId: '', useOwnKey: true }
      };
    }

    if (!userId) {
      return { error: 'Missing user id', code: ERetCode.USER_ID_MISSING };
    }

    // 查询用户信息
    const user = await this.userService.getUserById(c, userId);
    if (!user) {
      return { error: 'User not found', code: ERetCode.USER_NOT_FOUND };
    }


    const { memberAccount } = user;
    if (!memberAccount) {
      // 提示：你尚未订阅任何产品
      return { error: ErrorMessages[ERetCode.MEMBERSHIP_NOT_FOUND], code: ERetCode.MEMBERSHIP_NOT_FOUND };
    }

    const { level, status, id: accountId } = memberAccount;
    if (status !== EMembershipStatus.ACTIVE) {
      return { error: AccountStatusTips[status as EMembershipStatus], code: ERetCode.MEMBERSHIP_INVALID };
    }

    const hasPaidToken = [EMembershipLevel.PRO, EMembershipLevel.ULTRA].includes(level);
    if (!hasPaidToken) {
      return { error: ErrorMessages[ERetCode.TOKEN_INVALID], code: ERetCode.TOKEN_INVALID };
    }

    const accountUsage = await this.userService.getAccountUsage(c, accountId);
    if (!accountUsage) {
      return { error: ErrorMessages[ERetCode.USER_USAGE_NOT_FOUND], code: ERetCode.USER_USAGE_NOT_FOUND };
    }

    // 检查系统配置的key
    const systemApiKey = this.getProviderKey(c, provider);
    if (!systemApiKey) {
      return { error: ErrorMessages[ERetCode.SYSTEM_API_KEY_MISSING], code: ERetCode.SYSTEM_API_KEY_MISSING };
    }

    // 最后检查付费用户的token
    if (accountUsage.usage >= accountUsage.limit) {
      return { error: ErrorMessages[ERetCode.USAGE_RUNOUT], code: ERetCode.USAGE_RUNOUT };
    }

    return {
      error: '',
      code: ERetCode.SUCCESS,
      data: { apiKey: systemApiKey, accountId, useOwnKey: false }
    }
  }

  private getProviderKey() {
    switch (provider) {
      case 'OpenAI':
        return c.env.OPENAI_KEY;
      case 'Claude':
        return c.env.CLAUDE_KEY;
      case 'Llama':
        return c.env.LLAMA_KEY;
      case 'Gemini':
        return c.env.GEMINI_KEY;
      default:
        return undefined;
    }
  }
}


export default UnionAI;
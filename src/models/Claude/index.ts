import { ProviderMaxToken } from "@/src/const";
import { ProviderConfig } from "@/types/index";
import Anthropic from "@anthropic-ai/sdk";

export async function Claude({ model, apiKey, messages, maxTokens, onData, onDone }: ProviderConfig) {
    const client = new Anthropic({ apiKey });

    console.log('====chat stream start=====');

    const processedMessages = [];
    let lastRole = '';
    // 遍历原始消息
    for (const message of messages) {
        // 忽略不支持的角色
        if (message.role !== 'user' && message.role !== 'assistant') continue;

        // 检查内容是否为空
        if (!message.content && message.role === 'assistant') {
            // 如果是助手消息且内容为空，跳过
            continue;
        }

        // 只添加与上一个角色不同的消息
        if (message.role !== lastRole) {
            processedMessages.push(message);
            lastRole = message.role; // 更新最后一个角色
        }
    }

    // 确保第一条消息是 user
    if (processedMessages.length > 0 && processedMessages[0].role !== 'user') {
        // 如果第一条消息不是 user，删除它并添加一个默认的 user 消息
        processedMessages.shift(); // 删除第一条消息
        processedMessages.unshift({ "content": "请问你可以帮助我做什么？", "role": "user" });
    }

    const streamInstance = await client.messages.stream({
        // TODO: 可以在外层统一处理一下这种缺省的参数
        max_tokens: maxTokens ?? ProviderMaxToken.Claude[model],
        messages: processedMessages,
        model,
        stream: true,
    });
    const responseStream = await streamInstance.on('text', async (text: string) => {
        if (text) {
            await onData({ choices: [{ delta: { content: text } }] });
        }
    });
    // 监听流的结束事件
    streamInstance.on('end', () => {
        onDone(); // 在流结束时调用 onDone
    });

    const message = await responseStream.finalMessage();
    const { input_tokens, output_tokens } = message.usage;
    return {
        completion_tokens: output_tokens,
        prompt_tokens: input_tokens,
        total_tokens: input_tokens + output_tokens,
    }
}

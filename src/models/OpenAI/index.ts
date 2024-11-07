import { Usage, ProviderConfig } from "@/types";
import openai from "openai";
export async function OpenAI({ model, onDone, apiKey, messages, maxTokens, onData }: ProviderConfig) {
    const openAI = new openai({ apiKey, timeout: 10000 });
    const responseStream = await openAI.chat.completions.create({
        model,
        messages,
        max_tokens: maxTokens,
        stream: true,
        stream_options: {
            include_usage: true,
        }
    })

    console.log('=======chat stream start=======');

    let usageInfo: Usage | undefined;
    for await (const chunk of responseStream) {
        console.log('====chunk', JSON.stringify(chunk));
        const content = chunk.choices[0]?.delta?.content || '';
        usageInfo = chunk.usage as Usage;
        if (content) {
            await onData(chunk);
        }
    }
    onDone();
    console.log('====chat stream end=====', usageInfo);

    return usageInfo;
}

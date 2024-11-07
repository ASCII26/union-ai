import { Usage, ProviderConfig } from "@/types/index";
import { GoogleGenerativeAI } from "@google/generative-ai";
export async function Gemini({ model, onDone, apiKey, messages, onData }: ProviderConfig) {
    const client = new GoogleGenerativeAI(apiKey);
    const generativeModel = client.getGenerativeModel({ model });
    const chat = generativeModel.startChat({
        history: messages
            .filter((message: { role: string; content: any; }) => message.role !== "system") // 过滤掉 role 为 system 的消息
            .map((message: { role: string; content: any; }) => {
                return {
                    role: message.role === "assistant" ? "model" : "user",
                    parts: [{ text: message.content }]
                };
            })
    })


    let usageInfo: Usage | undefined;
    const result = await chat.sendMessageStream(messages[messages.length - 1].content);
    for await (const chunk of result.stream) {
        const content = chunk.text();
        let result = {
            choices: [{
                delta: {
                    content: chunk.candidates?.[0].content.parts?.[0].text || ""
                }
            }]
        }
        if (content) {
            await onData(result);
        }
        if (chunk.usageMetadata) {
            const { promptTokenCount, candidatesTokenCount, totalTokenCount } = chunk.usageMetadata;
            usageInfo = {
                completion_tokens: candidatesTokenCount,
                prompt_tokens: promptTokenCount,
                total_tokens: totalTokenCount
            };
        }
    }
    onDone();

    return usageInfo
}
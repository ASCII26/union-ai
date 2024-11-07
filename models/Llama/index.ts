import { CompletionUsage, IInitProviderParams } from "@/types";
import { safeJsonParse } from "@/utils/utils";

const llamaApiEndpoint = 'https://api.llama-api.com/chat/completions'
export async function Llama({ model, onDone, apiKey, messages, onData }: IInitProviderParams) {
    const response = await fetch(llamaApiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model,
            messages,
            stream: true,
        })
    })

    console.log('====response', response);
    if (!response.ok) {
        throw new Error('Failed to get response from LLaMA AI')
    }

    const reader = response.body?.getReader()
    if (!reader) {
        throw new Error('Failed to get reader from response')
    }

    let usageInfo: CompletionUsage | undefined;
    let buffer = ''
    const decoder = new TextDecoder()
    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')

        buffer = lines.pop() || ''

        for await (const line of lines) {
            if (line.startsWith('data: ')) {
                const jsonData = line.slice(6)  // Remove 'data: ' prefix
                try {
                    const data = safeJsonParse<any>(jsonData)
                    const content = data.choices?.[0]?.delta?.content || ''
                    if (content) {
                        console.log('====content', content);
                        await onData(data);
                    }
                    // You can handle usage info here if needed
                    if (data.usage) {
                        usageInfo = data.usage;
                    }

                } catch (e) {
                    console.error('Failed to parse JSON:', e)
                }
            }
        }
    }

    onDone();
    return usageInfo;
}
export function safeJsonParse<T>(str: string = '{}'): T | undefined {
    try {
        return JSON.parse(str)
    }
    catch (error) {
        console.error('safeJsonParse error:', error)
        return undefined
    }
}

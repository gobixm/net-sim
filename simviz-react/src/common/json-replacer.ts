export function defaultJsonReplacer(key: string, value: unknown): unknown {
    if (value instanceof Map) {
        return Object.fromEntries(value.entries());
    } if (value instanceof Set) {
        return Array.from(value.values());
    } else {
        return value;
    }
}

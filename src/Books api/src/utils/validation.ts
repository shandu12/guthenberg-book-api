
/**
 * Type guard for array validation
 */
export function isArray<T>(value: unknown): value is T[] {
    return Array.isArray(value);
}

/**
 * Safely access first array element
 */
export function getFirstElement<T>(arr: unknown[]): T | null {
    if (!isArray(arr) || arr.length === 0) {
        return null;
    }
    return arr[0] as T;
}

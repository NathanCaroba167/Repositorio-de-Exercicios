export function getStoredList<T>(key: string, fallback: T[]) {
    try {
        const stored = localStorage.getItem(key)
        return stored ? JSON.parse(stored) as T[] : fallback
    } catch {
        return fallback
    }
}

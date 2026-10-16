import { createContext, useState } from "react";

export type StudyContextValue = {
    enrolled: string[]
    completed: number[]
    liked: number[]
    toggleEnrolled: (subject: string) => void
    toggleCompleted: (exerciseId: number) => void
    toggleLiked: (exerciseId: number) => void
}

export const StudyContext = createContext<StudyContextValue | null>(null)

export function getStoredList<T>(key: string, fallback: T[]) {
    try {
        const stored = localStorage.getItem(key)
        return stored ? JSON.parse(stored) as T[] : fallback
    } catch {
        return fallback
    }
}

export function StudyProvider({ children }: { children: React.ReactNode }) {
    const [enrolled, setEnrolled] = useState<string[]>(() =>
        getStoredList("exercita-enrolled", ["Algoritmos", "Cálculo I"]),
    )
    const [completed, setCompleted] = useState<number[]>(() =>
        getStoredList("exercita-completed", []),
    )
    const [liked, setLiked] = useState<number[]>(() =>
        getStoredList("exercita-liked", []),
    )

    function toggleItem<T>(
        key: string,
        item: T,
        setter: React.Dispatch<React.SetStateAction<T[]>>,
    ) {
        setter((current) => {
            const next = current.includes(item)
                ? current.filter((value) => value !== item)
                : [...current, item]
            localStorage.setItem(key, JSON.stringify(next))
            return next
        })
    }

    return (
        <StudyContext.Provider
            value={{
                enrolled,
                completed,
                liked,
                toggleEnrolled: (subject) =>
                    toggleItem("exercita-enrolled", subject, setEnrolled),
                toggleCompleted: (exerciseId) =>
                    toggleItem("exercita-completed", exerciseId, setCompleted),
                toggleLiked: (exerciseId) =>
                    toggleItem("exercita-liked", exerciseId, setLiked),
            }}
        >
            {children}
        </StudyContext.Provider>
    )
}
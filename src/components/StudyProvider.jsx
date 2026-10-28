import { createContext, useState, useContext } from "react";

export const StudyContext = createContext(null);

export function getStoredList(key, fallback) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
}

export function StudyProvider({ children }) {
    const [enrolled, setEnrolled] = useState(() =>
        getStoredList("exercita-enrolled", ["Algoritmos", "Cálculo I"])
    );
    const [completed, setCompleted] = useState(() =>
        getStoredList("exercita-completed", [])
    );
    const [liked, setLiked] = useState(() =>
        getStoredList("exercita-liked", [])
    );

    function toggleItem(key, item, setter) {
        setter((current) => {
            const next = current.includes(item)
                ? current.filter((value) => value !== item)
                : [...current, item];
            localStorage.setItem(key, JSON.stringify(next));
            return next;
        });
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
    );
}

export function useStudy() {
    const context = useContext(StudyContext);
    if (!context) {
        throw new Error("useStudy deve ser usado dentro de StudyProvider");
    }
    return context;
}
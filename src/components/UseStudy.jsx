import { useContext } from "react";
import { StudyContext } from "./StudyProvider";

export function useStudy() {
    const context = useContext(StudyContext);
    if (!context) {
        throw new Error("useStudy deve ser usado dentro de StudyProvider");
    }
    return context;
}
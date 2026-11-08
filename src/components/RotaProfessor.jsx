import { Navigate } from "react-router";
import { useAuth } from "./AuthProvider";

export function RotaProfessor({ children }) {
    const { usuario } = useAuth();
    if (!usuario) return <Navigate to="/login" replace />;
    if (usuario.tipo !== "professor") return <Navigate to="/" replace />;
    return children;
}
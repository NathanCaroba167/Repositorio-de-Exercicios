import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./components/AuthProvider";
import { AppShell } from "./components/AppShell";
import { SearchPage } from "./pages/SearchPage";
import { SubjectsPage } from "./pages/SubjectsPage";
import { SubjectPage } from "./pages/SubjectPage";
import { RecentPage } from "./pages/RecentPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { MyCoursePage } from "./pages/MyCoursePage";
import { ExercisePage } from "./pages/ExercisePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { GerenciarDisciplinaPage } from "./pages/GerenciarDisciplinaPage";
import { RotaProfessor } from "./components/RotaProfessor";

export const router = createBrowserRouter([
    { path: "/login", Component: LoginPage },
    { path: "/cadastro", Component: RegisterPage },
    {
        path: "/",
        Component: AppShell,
        children: [
            { index: true, Component: SearchPage },
            { path: "materias", Component: SubjectsPage },
            { path: "materias/:subjectSlug", Component: SubjectPage },
            { path: "meu-curso", Component: MyCoursePage },
            { path: "gerenciar-disciplina",
                element: (
                    <RotaProfessor>
                        <GerenciarDisciplinaPage />
                    </RotaProfessor>
                )
            },
            { path: "exercicios/:exerciseId", Component: ExercisePage },
            { path: "recentes", Component: RecentPage },
            { path: "*", Component: NotFoundPage },
        ],
    },
])

export default function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    )
}
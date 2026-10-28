import { createBrowserRouter, RouterProvider } from "react-router"
import { AppShell } from "./components/AppShell"
import { SearchPage } from "./pages/SearchPage"
import { SubjectsPage } from "./pages/SubjectsPage"
import { SubjectPage } from "./pages/SubjectPage"
import { RecentPage } from "./pages/RecentPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { MyCoursePage } from "./pages/MyCoursePage"
import { ExercisePage } from "./pages/ExercisePage"

export const router = createBrowserRouter([
    {
        path: "/",
        Component: AppShell,
        children: [
            { index: true, Component: SearchPage },
            { path: "materias", Component: SubjectsPage },
            { path: "materias/:subjectSlug", Component: SubjectPage },
            { path: "meu-curso", Component: MyCoursePage },
            { path: "exercicios/:exerciseId", Component: ExercisePage },
            { path: "recentes", Component: RecentPage },
            { path: "*", Component: NotFoundPage },
        ],
    },
])

export default function App() {
    return <RouterProvider router={router} />
}
import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import { useStudy } from "../components/UseStudy";
import { exercises, subjects, professors, colorClasses } from "../data/exercises";
import { Icon } from "../components/Icon";
import { PageSection } from "../components/PageSection";
import { toSlug } from "../components/ToSlug";

import { EmptyState } from "../components/EmptySpace";

export function SubjectsPage() {
  const { enrolled, completed } = useStudy();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim().toLocaleLowerCase("pt-BR") ?? "";
  const [professor, setProfessor] = useState("Todos os professores");
  const [showFilters, setShowFilters] = useState(false);

  const matchingExercises = exercises.filter(
    (exercise) =>
      (professor === "Todos os professores" ||
        exercise.professor === professor) &&
      (!query ||
        `${exercise.title} ${exercise.content} ${exercise.description} ${exercise.subject} ${exercise.professor}`
          .toLocaleLowerCase("pt-BR")
          .includes(query))
  );

  const filteredSubjects = subjects.filter((item) =>
    matchingExercises.some((exercise) => exercise.subject === item)
  );

  return (
    <PageSection
      eyebrow="Biblioteca"
      title={
        query
          ? `Resultados para “${searchParams.get("q")}”`
          : "Escolha uma matéria"
      }
      description={
        query
          ? "Selecione uma matéria para ver os conteúdos relacionados à sua busca."
          : "Acesse uma disciplina para explorar seus conteúdos e exercícios em ordem."
      }
      action={
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm md:hidden"
        >
          <Icon name="filter" size={18} /> Filtros
        </button>
      }
    >
      <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-orange-100 bg-orange-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-extrabold text-slate-900">
            {enrolled.length
              ? `Você está cursando ${enrolled.length} ${
                  enrolled.length === 1 ? "matéria" : "matérias"
                }`
              : "Quais matérias você está cursando?"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Personalize sua grade para acompanhar conclusões e progresso.
          </p>
        </div>
        <Link
          to="/meu-curso"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
        >
          <Icon name="grid" size={17} /> Gerenciar meu curso
        </Link>
      </div>
      <div className={`${showFilters ? "block" : "hidden"} mb-7 md:block`}>
        <label className="relative inline-block w-full md:w-64">
          <span className="sr-only">Filtrar por professor</span>
          <select
            value={professor}
            onChange={(event) => setProfessor(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white py-0 pl-4 pr-10 text-sm font-semibold text-slate-600 outline-none transition focus:border-orange-400"
          >
            <option>Todos os professores</option>
            {professors.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-3.5 rotate-90 text-slate-400">
            <Icon name="chevron" size={15} />
          </span>
        </label>
      </div>
      <p className="mb-5 text-sm font-semibold text-slate-500">
        {filteredSubjects.length}{" "}
        {filteredSubjects.length === 1 ? "matéria" : "matérias"}
      </p>
      {filteredSubjects.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredSubjects.map((item) => {
            const subjectExercises = matchingExercises.filter(
              (exercise) => exercise.subject === item
            );
            const sample = subjectExercises[0];
            const allSubjectExercises = exercises.filter(
              (exercise) => exercise.subject === item
            );
            const concluded = allSubjectExercises.filter((exercise) =>
              completed.includes(exercise.id)
            ).length;
            const progress = Math.round(
              (concluded / allSubjectExercises.length) * 100
            );
            return (
              <Link
                key={item}
                to={`/materias/${toSlug(item)}`}
                className="group flex min-h-52 flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_14px_35px_rgba(234,88,12,0.09)]"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`grid size-12 place-items-center rounded-xl border ${colorClasses[sample.color]}`}
                  >
                    <Icon name="book" size={22} />
                  </span>
                  <div className="text-right">
                    <span className="block text-xs font-bold text-slate-400">
                      {sample.code}
                    </span>
                    {enrolled.includes(item) && (
                      <span className="mt-2 inline-flex rounded-full bg-orange-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-orange-700">
                        Cursando
                      </span>
                    )}
                  </div>
                </div>
                <h2 className="mt-5 text-xl font-extrabold tracking-[-0.025em] text-slate-900">
                  {item}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {subjectExercises.length}{" "}
                  {subjectExercises.length === 1
                    ? "conteúdo disponível"
                    : "conteúdos disponíveis"}
                </p>
                {enrolled.includes(item) && (
                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between text-[11px] font-bold text-slate-500">
                      <span>
                        {concluded} de {allSubjectExercises.length} concluídos
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-orange-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
                <span className="mt-auto flex items-center justify-between pt-6 text-sm font-bold text-orange-600">
                  Ver conteúdos
                  <span className="transition group-hover:translate-x-1">
                    <Icon name="arrow" size={18} />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState />
      )}
    </PageSection>
  );
}
import React from "react";

export function PageSection({
                                eyebrow,
                                title,
                                description,
                                action,
                                children,
                            }: {
    eyebrow: string
    title: string
    description: string
    action?: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <section className="mx-auto min-h-[calc(100vh-146px)] max-w-[1280px] px-5 py-10 lg:px-8 lg:py-14">
            <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">
                        {eyebrow}
                    </p>
                    <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.035em] text-slate-950">
                        {title}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        {description}
                    </p>
                </div>
                {action}
            </div>
            {children}
        </section>
    )
}
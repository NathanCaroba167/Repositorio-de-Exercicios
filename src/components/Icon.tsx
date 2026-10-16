import React from "react";

export type IconName = "arrow" | "book" | "bookmark" | "calendar" | "check" | "chevron" | "clock" | "eye" | "eyeOff" | "filter" | "grid" | "search" | "spark" | "thumb" | "trend" | "user"

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
    const paths: Record<IconName, React.ReactNode> = {
        arrow: (
            <>
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
            </>
        ),
        book: (
            <>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
            </>
        ),
        bookmark: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
        calendar: (
            <>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
            </>
        ),
        check: <path d="m5 12 4 4L19 6" />,
        chevron: <path d="m9 18 6-6-6-6" />,
        clock: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </>
        ),
        eye: (
            <>
                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                <circle cx="12" cy="12" r="2.5" />
            </>
        ),
        eyeOff: (
            <>
                <path d="m3 3 18 18" />
                <path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6 0 9.5 6 9.5 6a16 16 0 0 1-2.1 2.8M6.3 6.4C3.9 8.2 2.5 12 2.5 12s3.5 6 9.5 6c1 0 2-.2 2.8-.5" />
            </>
        ),
        filter: <path d="M4 6h16M7 12h10M10 18h4" />,
        grid: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </>
        ),
        search: (
            <>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
            </>
        ),
        spark: (
            <path d="m12 3-1.5 5.5L5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z" />
        ),
        thumb: (
            <>
                <path d="M7 10v11H3V10h4ZM7 18h10.4a2 2 0 0 0 2-1.7l1-6A2 2 0 0 0 18.4 8H14l.7-3.2A2.3 2.3 0 0 0 12.5 2L7 10Z" />
            </>
        ),
        trend: (
            <>
                <path d="m3 17 6-6 4 4 8-9" />
                <path d="M15 6h6v6" />
            </>
        ),
        user: (
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
            </>
        ),
    }

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {paths[name]}
        </svg>
    )
}
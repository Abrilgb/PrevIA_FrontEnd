/**
 * Skeleton — Bloque de carga animado con efecto pulse.
 *
 * Props:
 *  - className  (string)   Clases adicionales (width, height, rounded, etc.)
 *  - circle     (boolean)  Si es true, aplica rounded-full (para avatares)
 */
export function Skeleton({ className = '', circle = false }) {
    return (
        <div
            className={`animate-pulse bg-slate-200 dark:bg-slate-700 ${circle ? 'rounded-full' : 'rounded-xl'} ${className}`}
        />
    );
}

/**
 * SkeletonText — Líneas de texto simuladas.
 *
 * Props:
 *  - lines     (number)   Número de líneas (default: 3)
 *  - lastWidth (string)   Ancho de la última línea (default: 'w-3/4')
 */
export function SkeletonText({ lines = 3, lastWidth = 'w-3/4' }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-3 ${i === lines - 1 ? lastWidth : 'w-full'}`}
                />
            ))}
        </div>
    );
}

/**
 * SkeletonStatCard — Placeholder para una StatCard del dashboard.
 */
export function SkeletonStatCard() {
    return (
        <div className="bg-pure-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-light-teal/20 dark:border-slate-700 flex flex-col gap-3 animate-pulse">
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-9 w-24 mt-1" />
            <Skeleton className="h-6 w-40 rounded-lg" />
        </div>
    );
}

/**
 * SkeletonChartCard — Placeholder para una ChartCard del dashboard.
 */
export function SkeletonChartCard() {
    return (
        <div className="bg-pure-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-light-teal/20 dark:border-slate-700 animate-pulse">
            <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
            {/* Barras simuladas de gráfica */}
            <div className="h-[300px] flex items-end gap-3 px-2">
                {[60, 45, 80, 55, 90, 70, 65].map((h, i) => (
                    <Skeleton
                        key={i}
                        className="flex-1 rounded-t-xl"
                        style={{ height: `${h}%` }}
                    />
                ))}
            </div>
        </div>
    );
}

/**
 * SkeletonFormCard — Placeholder para páginas de formulario (sleep, walk, nutricion).
 */
export function SkeletonFormCard() {
    return (
        <div className="bg-pure-white p-6 sm:p-10 rounded-3xl shadow-sm border border-light-teal/20 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <Skeleton className="h-4 w-24" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-14 w-full rounded-2xl" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-14 w-full rounded-2xl" />
                        </div>
                    </div>
                    <div className="space-y-3 pt-2">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-4 w-full rounded-full" />
                    </div>
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex flex-wrap gap-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="flex-1 min-w-[90px] h-20 rounded-2xl" />
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-24 w-full rounded-2xl" />
                    </div>
                </div>
            </div>
            <div className="pt-6 mt-6 border-t border-light-teal/10">
                <Skeleton className="h-14 w-48 rounded-2xl" />
            </div>
        </div>
    );
}

/**
 * SkeletonPageHeader — Placeholder para el header de páginas internas.
 */
export function SkeletonPageHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-pulse">
            <div className="space-y-2">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-16 w-40 rounded-3xl" />
        </div>
    );
}

/**
 * SkeletonDashboard — Skeleton completo para la página del dashboard.
 */
export function SkeletonDashboard() {
    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 lg:space-y-8 font-[Manrope]">
            {/* Streak + Badges */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="lg:col-span-1 h-48 rounded-2xl" />
                <Skeleton className="lg:col-span-2 h-48 rounded-2xl" />
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <SkeletonChartCard />
                <SkeletonChartCard />
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="lg:col-span-2 h-64 rounded-2xl" />
            </div>
        </div>
    );
}

/**
 * StatCard — Card de estadística del dashboard.
 *
 * Props:
 *  - icon       (string)   Emoji del icono
 *  - label      (string)   Nombre de la métrica
 *  - value      (string)   Valor principal (ej: "6,840")
 *  - unit       (string)   Unidad opcional (ej: "kcal", "hrs")
 *  - trend      (string)   Texto de tendencia (ej: "↑ 12% vs semana anterior")
 *  - trendUp    (boolean)  Si la tendencia es positiva (verde) o negativa (rojo)
 */
export default function StatCard({ icon, label, value, unit, trend, trendUp = true }) {
    return (
        <div className="bg-pure-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-light-teal/20 dark:border-slate-700 flex flex-col hover:border-light-teal transition-colors">
            <div className="flex items-center gap-3 mb-2">
                <span className="p-2 bg-light-teal/20 dark:bg-teal-dark/10 text-teal-dark dark:text-light-teal rounded-xl text-xl">
                    {icon}
                </span>
                <span className="font-bold text-dark-blue/70 dark:text-pure-white/70">{label}</span>
            </div>
            <span className="text-4xl font-black text-dark-blue dark:text-pure-white mt-2">
                {value}
                {unit && (
                    <span className="text-xl text-dark-blue/50 dark:text-pure-white/50 font-semibold"> {unit}</span>
                )}
            </span>
            {trend && (
                <span className={`text-sm font-bold mt-3 w-fit px-2 py-1 rounded-lg ${
                    trendUp
                        ? 'text-teal-dark dark:text-light-teal bg-light-teal/10 dark:bg-teal-dark/10'
                        : 'text-red-500/80 bg-red-500/10'
                }`}>
                    {trend}
                </span>
            )}
        </div>
    );
}

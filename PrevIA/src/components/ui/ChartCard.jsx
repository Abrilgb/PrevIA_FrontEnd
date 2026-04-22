/**
 * ChartCard — Wrapper para gráficas con título y selector de periodo.
 *
 * Props:
 *  - title       (string)     Título de la gráfica
 *  - periods     (string[])   Opciones del selector (default: ['Esta semana', 'Mes anterior'])
 *  - height      (number)     Altura del contenedor de la gráfica (default: 300)
 *  - children    (ReactNode)  Contenido de la gráfica (ResponsiveContainer de Recharts)
 */
export default function ChartCard({ title, periods = ['Esta semana', 'Mes anterior'], height = 300, children }) {
    return (
        <div className="bg-pure-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-light-teal/20 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-dark-blue dark:text-pure-white">{title}</h3>
                <select className="bg-slate-50 dark:bg-slate-900 border border-light-teal/30 dark:border-slate-700 text-dark-blue dark:text-pure-white text-sm rounded-lg px-3 py-1.5 font-semibold outline-none focus:border-light-teal transition-colors">
                    {periods.map((p) => (
                        <option key={p}>{p}</option>
                    ))}
                </select>
            </div>
            <div style={{ height: `${height}px` }} className="w-full">
                {children}
            </div>
        </div>
    );
}

/**
 * PageHeader — Header de página interna con título y subtítulo.
 *
 * Props:
 *  - title       (string)     Título principal
 *  - subtitle    (string)     Descripción debajo del título
 *  - children    (ReactNode)  Contenido extra a la derecha (ej: badge, stat card)
 */
export default function PageHeader({ title, subtitle, children }) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl font-black text-dark-blue dark:text-pure-white tracking-tight">{title}</h1>
                {subtitle && (
                    <p className="text-dark-blue/60 dark:text-pure-white/60 font-medium mt-1">{subtitle}</p>
                )}
            </div>
            {children}
        </div>
    );
}

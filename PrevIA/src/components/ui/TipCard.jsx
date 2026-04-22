/**
 * TipCard — Card de tip/insight que se usa en sleep, walk y nutricion.
 *
 * Props:
 *  - emoji       (string)   Emoji del icono
 *  - title       (string)   Título del tip
 *  - description (string)   Texto del tip
 *  - gradient    (string)   Clases de gradiente de fondo (default: light-teal)
 */
export default function TipCard({
    emoji,
    title,
    description,
    gradient = 'from-light-teal/10 to-teal-dark/5 border-light-teal/20',
}) {
    return (
        <div className={`bg-gradient-to-br ${gradient} p-6 rounded-3xl border flex gap-4 items-start group hover:shadow-sm transition-all`}>
            <span className="text-3xl filter group-hover:scale-110 transition-transform flex-shrink-0">
                {emoji}
            </span>
            <div>
                <h4 className="font-black text-dark-blue text-xs dark:text-light-teal transition-colors uppercase tracking-wider">{title}</h4>
                <p className="text-dark-blue/60 text-xs font-bold mt-2 dark:text-light-teal transition-colorsleading-relaxed">{description}</p>
            </div>
        </div>
    );
}

/**
 * SectionTitle — Título de sección con borde lateral de color.
 *
 * Props:
 *  - children    (ReactNode)  Texto del título
 *  - color       (string)     Color del borde lateral (default: 'border-teal-dark')
 *  - className   (string)     Clases adicionales
 */
export default function SectionTitle({ children, color = 'border-teal-dark', className = '' }) {
    return (
        <h2 className={`text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-widest border-l-4 ${color} pl-3 ${className}`}>
            {children}
        </h2>
    );
}

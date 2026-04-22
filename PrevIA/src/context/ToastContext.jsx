import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext();

// Hook para usar toasts en cualquier componente
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast debe usarse dentro de ToastProvider');
    return context;
};

// Iconos SVG por tipo
const icons = {
    success: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    ),
    error: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    warning: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86l-8.6 14.86A1 1 0 002.54 20h18.92a1 1 0 00.85-1.28l-8.6-14.86a1 1 0 00-1.7 0z" />
        </svg>
    ),
    info: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
    ),
};

// Estilos por tipo de toast
const styles = {
    success: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/30',
        border: 'border-emerald-200 dark:border-emerald-700/50',
        icon: 'bg-emerald-500 text-white',
        title: 'text-emerald-900 dark:text-emerald-100',
        message: 'text-emerald-700 dark:text-emerald-300',
        progress: 'bg-emerald-500',
    },
    error: {
        bg: 'bg-red-50 dark:bg-red-900/30',
        border: 'border-red-200 dark:border-red-700/50',
        icon: 'bg-red-500 text-white',
        title: 'text-red-900 dark:text-red-100',
        message: 'text-red-700 dark:text-red-300',
        progress: 'bg-red-500',
    },
    warning: {
        bg: 'bg-amber-50 dark:bg-amber-900/30',
        border: 'border-amber-200 dark:border-amber-700/50',
        icon: 'bg-amber-500 text-white',
        title: 'text-amber-900 dark:text-amber-100',
        message: 'text-amber-700 dark:text-amber-300',
        progress: 'bg-amber-500',
    },
    info: {
        bg: 'bg-sky-50 dark:bg-sky-900/30',
        border: 'border-sky-200 dark:border-sky-700/50',
        icon: 'bg-teal-dark text-white',
        title: 'text-sky-900 dark:text-sky-100',
        message: 'text-sky-700 dark:text-sky-300',
        progress: 'bg-teal-dark',
    },
};

// Componente individual de Toast
function Toast({ toast, onDismiss }) {
    const style = styles[toast.type] || styles.info;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`relative w-[360px] max-w-[90vw] ${style.bg} border ${style.border} rounded-2xl shadow-xl shadow-black/5 overflow-hidden font-[Manrope] backdrop-blur-sm`}
        >
            <div className="flex items-start gap-3 p-4">
                {/* Icono */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-xl ${style.icon} flex items-center justify-center`}>
                    {icons[toast.type] || icons.info}
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0 pt-0.5">
                    {toast.title && (
                        <p className={`text-sm font-black ${style.title} tracking-tight`}>
                            {toast.title}
                        </p>
                    )}
                    <p className={`text-xs font-semibold ${style.message} mt-0.5 leading-relaxed`}>
                        {toast.message}
                    </p>
                </div>

                {/* Botón cerrar */}
                <button
                    onClick={() => onDismiss(toast.id)}
                    className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    aria-label="Cerrar notificación"
                >
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Barra de progreso animada */}
            <motion.div
                className={`h-[3px] ${style.progress} rounded-full mx-2 mb-1`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: (toast.duration || 4000) / 1000, ease: 'linear' }}
            />
        </motion.div>
    );
}

// Provider
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismissToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, type, title, message, duration }]);

        if (duration > 0) {
            setTimeout(() => dismissToast(id), duration);
        }

        return id;
    }, [dismissToast]);

    // Atajos de conveniencia
    const toast = useCallback((message, title) => addToast({ type: 'info', title, message }), [addToast]);
    toast.success = (message, title) => addToast({ type: 'success', title, message });
    toast.error = (message, title) => addToast({ type: 'error', title, message });
    toast.warning = (message, title) => addToast({ type: 'warning', title, message });
    toast.info = (message, title) => addToast({ type: 'info', title, message });

    return (
        <ToastContext.Provider value={{ toast, addToast, dismissToast }}>
            {children}

            {/* Contenedor de toasts flotante */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => (
                        <div key={t.id} className="pointer-events-auto">
                            <Toast toast={t} onDismiss={dismissToast} />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

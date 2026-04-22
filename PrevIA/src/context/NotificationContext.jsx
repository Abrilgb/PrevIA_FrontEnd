import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications debe usarse dentro de NotificationProvider');
    return ctx;
};

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([
        // Notificaciones de ejemplo para mostrar el sistema desde el inicio
        {
            id: 1,
            type: 'success',
            title: '¡Bienvenido a PrevIA!',
            message: 'Tu perfil está listo. Comienza registrando tu primera actividad.',
            icon: '🎉',
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 5), // hace 5 min
        },
        {
            id: 2,
            type: 'info',
            title: 'Meta semanal activa',
            message: 'Tienes 150 min de actividad como objetivo esta semana. ¡Tú puedes!',
            icon: '🎯',
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30), // hace 30 min
        },
        {
            id: 3,
            type: 'warning',
            title: 'Recuerda registrar tu sueño',
            message: 'No has registrado tu sueño de anoche. Mantén el historial completo.',
            icon: '🌙',
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // hace 2h
        },
    ]);

    // Añadir notificación
    const notify = useCallback(({ type = 'info', title, message, icon = '🔔' }) => {
        const id = Date.now() + Math.random();
        setNotifications((prev) => [
            { id, type, title, message, icon, read: false, createdAt: new Date() },
            ...prev,
        ]);
        return id;
    }, []);

    // Marcar una como leída
    const markAsRead = useCallback((id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    // Marcar todas como leídas
    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    // Descartar una notificación
    const dismiss = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    // Descartar todas
    const dismissAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{ notifications, unreadCount, notify, markAsRead, markAllAsRead, dismiss, dismissAll }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

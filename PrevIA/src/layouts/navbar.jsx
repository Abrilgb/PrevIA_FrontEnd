import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/PrevIa.png";
import { useNotifications } from "../context/NotificationContext";
import {User as UserIcon} from "lucide-react";

// Colores por tipo de notificación
const typeStyles = {
    success: { dot: 'bg-emerald-400', bg: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20' },
    info:    { dot: 'bg-sky-400',     bg: 'hover:bg-sky-50 dark:hover:bg-sky-900/20' },
    warning: { dot: 'bg-amber-400',   bg: 'hover:bg-amber-50 dark:hover:bg-amber-900/20' },
    error:   { dot: 'bg-red-400',     bg: 'hover:bg-red-50 dark:hover:bg-red-900/20' },
};

// Formatea tiempo relativo
function timeAgo(date) {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return 'Ahora';
    if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
    return `hace ${Math.floor(diff / 86400)}d`;
}

export default function Navbar({ isDashboard = false, onToggle, isSidebarOpen }) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const location = useLocation();
    const panelRef = useRef(null);

    const { notifications, unreadCount, markAsRead, markAllAsRead, dismiss, dismissAll } = useNotifications();

    // Rutas donde NO queremos mostrar el botón de "Ingresar"
    const authRoutes = ["/dashboard", "/perfil", "/sleep", "/nutricion", "/walk", "/configuracion", "/formulario_personal", "/bienestar"];
    const hideAuthButton = authRoutes.includes(location.pathname);

    // Cerrar panel al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(e) {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        }
        if (notifOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [notifOpen]);

    const handleBellClick = () => {
        setNotifOpen((v) => !v);
    };

    const handleNotifClick = (id) => {
        markAsRead(id);
    };

    return (
        <nav className="sticky top-0 z-50 bg-pure-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-light-teal/30 dark:border-slate-800 shadow-sm px-6 lg:px-12 py-3 min-h-[80px] flex items-center transition-colors duration-300">
            <div className="flex items-center justify-between w-full">
                {/* BRAND & TOGGLE */}
                <div className="flex items-center gap-4">
                    {isDashboard && (
                        <button
                            onClick={onToggle}
                            className="flex items-center gap-2 bg-light-teal/20 dark:bg-slate-800 hover:bg-light-teal/40 dark:hover:bg-slate-700 text-teal-dark dark:text-light-teal p-2.5 rounded-xl font-semibold transition-all active:scale-95 group"
                            aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${isSidebarOpen ? "" : "rotate-180"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            <span className="hidden sm:inline-block text-sm font-black uppercase tracking-tight text-teal-dark dark:text-light-teal">Menú</span>
                        </button>
                    )}

                    {(!isDashboard || !isSidebarOpen) && (
                        <Link to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-dark-blue to-teal-dark dark:from-light-teal dark:to-teal-dark tracking-tighter drop-shadow-sm flex items-center gap-2 cursor-pointer transition-all duration-300">
                            
                            <span className={isDashboard ? "hidden lg:block" : "block"}>PrevIA</span>
                        </Link>
                    )}
                </div>

                {/* DESKTOP LINKS */}
                {!isDashboard && (
                    <div className="hidden lg:flex items-center gap-8 font-semibold text-dark-blue/80 dark:text-pure-white/80">
                        <Link to="/" className="hover:text-teal-dark dark:hover:text-light-teal transition cursor-pointer">Inicio</Link>
                        <Link to="/dashboard" className="hover:text-teal-dark dark:hover:text-light-teal transition cursor-pointer">Dashboard</Link>
                        <Link to="/perfil" className="hover:text-teal-dark dark:hover:text-light-teal transition cursor-pointer">Perfil</Link>
                    </div>
                )}

                {/* RIGHT SIDE ACTIONS */}
                <div className="flex items-center gap-3">

                    {/* ── CAMPANITA DE NOTIFICACIONES ── */}
                    <div className="hidden sm:flex relative" ref={panelRef}>
                        <button
                            onClick={handleBellClick}
                            className="p-2 text-dark-blue dark:text-pure-white hover:bg-light-teal/20 dark:hover:bg-slate-800 rounded-full transition-colors relative"
                            aria-label="Notificaciones"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>

                            {/* Badge con el conteo */}
                            <AnimatePresence>
                                {unreadCount > 0 && (
                                    <motion.span
                                        key="badge"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-sm"
                                    >
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>

                        {/* ── PANEL DROPDOWN ── */}
                        <AnimatePresence>
                            {notifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    className="absolute top-full right-0 mt-3 w-[360px] max-w-[90vw] bg-pure-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-dark-blue/10 border border-light-teal/20 dark:border-slate-700 overflow-hidden font-[Manrope] z-50"
                                >
                                    {/* Header del panel */}
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-light-teal/10 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-wider">Notificaciones</h3>
                                            {unreadCount > 0 && (
                                                <span className="text-[10px] font-black bg-teal-dark text-white px-2 py-0.5 rounded-full">
                                                    {unreadCount} nuevas
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-[10px] font-black text-teal-dark dark:text-light-teal hover:underline uppercase tracking-wider"
                                                >
                                                    Marcar todas
                                                </button>
                                            )}
                                            {notifications.length > 0 && (
                                                <button
                                                    onClick={dismissAll}
                                                    className="text-[10px] font-black text-dark-blue/40 dark:text-pure-white/30 hover:text-red-400 dark:hover:text-red-400 uppercase tracking-wider transition-colors"
                                                >
                                                    Limpiar
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Lista de notificaciones */}
                                    <div className="max-h-[380px] overflow-y-auto">
                                        <AnimatePresence initial={false}>
                                            {notifications.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                                                    <span className="text-4xl mb-3">🔕</span>
                                                    <p className="text-sm font-black text-dark-blue/50 dark:text-pure-white/40">Sin notificaciones</p>
                                                    <p className="text-xs text-dark-blue/30 dark:text-pure-white/20 mt-1 font-medium">Todo al día por aquí</p>
                                                </div>
                                            ) : (
                                                notifications.map((n) => {
                                                    const style = typeStyles[n.type] || typeStyles.info;
                                                    return (
                                                        <motion.div
                                                            key={n.id}
                                                            layout
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -20, height: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            onClick={() => handleNotifClick(n.id)}
                                                            className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors border-b border-light-teal/5 dark:border-slate-800/50 last:border-0 ${style.bg} ${!n.read ? 'bg-light-teal/5 dark:bg-slate-800/30' : ''}`}
                                                        >
                                                            {/* Icono */}
                                                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
                                                                {n.icon}
                                                            </div>

                                                            {/* Contenido */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <p className={`text-xs font-black leading-tight ${!n.read ? 'text-dark-blue dark:text-pure-white' : 'text-dark-blue/60 dark:text-pure-white/50'}`}>
                                                                        {n.title}
                                                                    </p>
                                                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                                                        {!n.read && (
                                                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
                                                                        )}
                                                                        <button
                                                                            onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                                                                            className="p-0.5 rounded text-dark-blue/20 hover:text-red-400 transition-colors"
                                                                            aria-label="Descartar"
                                                                        >
                                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <p className="text-[11px] text-dark-blue/50 dark:text-pure-white/40 font-medium mt-0.5 leading-relaxed">
                                                                    {n.message}
                                                                </p>
                                                                <p className="text-[10px] font-bold text-dark-blue/30 dark:text-pure-white/20 mt-1.5 uppercase tracking-wider">
                                                                    {timeAgo(n.createdAt)}
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Avatar + botón ingresar */}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-light-teal to-teal-dark flex items-center justify-center text-pure-white font-black shadow-sm">
                            <UserIcon className="h-7 w-7" />
                        </div>
                        {!hideAuthButton && (
                            <Link to="/login" className="bg-dark-blue text-pure-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-dark hover:shadow-lg hover:shadow-teal-dark/30 transition-all duration-300 text-sm hidden sm:block">
                                Ingresar
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* MOBILE MENU DROPDOWN */}
            {(!isDashboard && isOpen) && (
                <div className="absolute top-full left-0 w-full bg-pure-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-light-teal/30 dark:border-slate-800 shadow-xl flex flex-col p-4 gap-2 lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link to="/" onClick={() => setIsOpen(false)} className="hover:bg-light-teal/30 dark:hover:bg-slate-800 hover:text-teal-dark dark:hover:text-light-teal rounded-xl px-4 py-3 font-semibold text-dark-blue dark:text-pure-white transition-colors">Inicio</Link>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="hover:bg-light-teal/30 dark:hover:bg-slate-800 hover:text-teal-dark dark:hover:text-light-teal rounded-xl px-4 py-3 font-semibold text-dark-blue dark:text-pure-white transition-colors">Dashboard</Link>
                    <Link to="/perfil" onClick={() => setIsOpen(false)} className="hover:bg-light-teal/30 dark:hover:bg-slate-800 hover:text-teal-dark dark:hover:text-light-teal rounded-xl px-4 py-3 font-semibold text-dark-blue dark:text-pure-white transition-colors">Perfil</Link>
                    {!hideAuthButton && (
                        <Link to="/login" onClick={() => setIsOpen(false)} className="bg-dark-blue text-pure-white rounded-xl px-4 py-3 font-bold text-center mt-2 hover:bg-teal-dark transition-colors">Ingresar</Link>
                    )}
                </div>
            )}
        </nav>
    );
}
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../layouts/sidebar';
import Breadcrumbs from '../layouts/breadcrums'; 
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

// Iconos de Lucide
import { Bell, Mail, Sun, Moon, Monitor, Lock, Share2, Settings, Droplet, Moon as MoonIcon, Activity, CheckCircle2, Watch } from 'lucide-react';

export default function Configuracion() {
    const { theme, setTheme, daltonismType, setDaltonismType, isGrayscale, setIsGrayscale } = useTheme();
    const { toast } = useToast();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [settings, setSettings] = useState({
        reminders: true,
        summaryEmail: false,
        publicProfile: false,
        shareData: true,
        units: 'metrico',
        meta_agua_vasos: 8,
        meta_sueno_horas: 8.0,
        meta_ejercicio_minutos: 30
    });

    useEffect(() => {
        const cargarConfiguracion = async () => {
            const token = localStorage.getItem('tokenPrevia');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:3000/api/perfil/metas', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSettings({
                        reminders: Boolean(data.notificaciones_recordatorios ?? true),
                        summaryEmail: Boolean(data.notificaciones_resumen ?? false),
                        publicProfile: Boolean(data.perfil_publico ?? false),
                        shareData: Boolean(data.compartir_datos ?? true),
                        units: data.sistema_unidades || 'metrico',
                        meta_agua_vasos: data.meta_agua_vasos || 8,
                        meta_sueno_horas: data.meta_sueno_horas || 8.0,
                        meta_ejercicio_minutos: data.meta_ejercicio_minutos || 30
                    });
                }
            } catch (error) {
                console.error('Error cargando configuración:', error);
                toast.error('No se pudieron cargar tus preferencias.');
            } finally {
                setIsLoading(false);
            }
        };

        cargarConfiguracion();
    }, [toast]);

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleInput = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveMetas = async () => {
        setIsSaving(true);
        const token = localStorage.getItem('tokenPrevia');

        try {
            const response = await fetch('http://localhost:3000/api/perfil/metas', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    notificaciones_recordatorios: settings.reminders,
                    notificaciones_resumen: settings.summaryEmail,
                    perfil_publico: settings.publicProfile,
                    compartir_datos: settings.shareData,
                    sistema_unidades: settings.units,
                    meta_agua_vasos: settings.meta_agua_vasos,
                    meta_sueno_horas: settings.meta_sueno_horas,
                    meta_ejercicio_minutos: settings.meta_ejercicio_minutos
                })
            });

            if (response.ok) {
                toast.success('Tus metas y preferencias han sido actualizadas.', '¡Configuración Guardada!');
            } else {
                toast.error('Hubo un problema al guardar la configuración.');
            }
        } catch (error) {
            console.error('Error guardando configuración:', error);
            toast.error('Error de conexión con el servidor.');
        } finally {
            setIsSaving(false);
        }
    };

    const SettingRow = ({ label, description, icon: Icon, active, onClick }) => (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-pure-white dark:bg-pure-white/5 border border-light-teal/20 dark:border-pure-white/10 hover:border-teal-dark dark:hover:border-light-teal transition-all group cursor-pointer shadow-md" onClick={onClick}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors ${active ? 'bg-teal-dark text-pure-white' : 'bg-light-teal/20 dark:bg-pure-white/10 text-teal-dark dark:text-light-teal'}`}>
                    <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <div>
                    <h4 className="font-black text-dark-blue dark:text-pure-white text-xs uppercase tracking-wider">{label}</h4>
                    <p className="text-[10px] font-bold text-dark-blue/50 dark:text-pure-white/50 mt-0.5">{description}</p>
                </div>
            </div>
            <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${active ? 'bg-teal-dark dark:bg-light-teal' : 'bg-light-teal/50 dark:bg-pure-white/10'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-pure-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );

    if (isLoading) {
        return (
            <Sidebar>
                <div className="flex items-center justify-center h-full w-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-dark dark:border-light-teal"></div>
                </div>
            </Sidebar>
        );
    }

    return (
        <Sidebar>
            {/* Contenedor Transparente: SIN FONDOS MASIVOS para que no se haga caja */}
            <div className="flex flex-col w-full h-full relative">
                
                {/* --- 1. BARRA DE BREADCRUMBS (Separada, limpia y sin bordes) --- */}
                <div className="w-full pt-2 pb-6 z-40">
                    <Breadcrumbs />
                </div>

                {/* --- 2. CONTENIDO DE CONFIGURACIÓN --- */}
                <div className="flex-1 w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="w-full max-w-5xl mx-auto space-y-8 font-[Manrope] animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16 px-6 lg:px-8">
                        
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-black text-dark-blue dark:text-pure-white tracking-tight">Configuraciones</h1>
                            <p className="text-dark-blue/60 dark:text-pure-white/60 font-medium mt-1">Personaliza tu experiencia y ajusta tus metas de salud.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* Columna Izquierda */}
                            <div className="space-y-8">
                                
                                <div className="space-y-6">
                                    <h2 className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-widest border-l-4 border-teal-dark pl-3">Notificaciones</h2>
                                    <div className="space-y-3">
                                        <SettingRow
                                            label="Recordatorios Diarios"
                                            description="Recibe alertas para registrar tus hábitos."
                                            icon={Bell}
                                            active={settings.reminders}
                                            onClick={() => toggleSetting('reminders')}
                                        />
                                        <SettingRow
                                            label="Resumen Semanal"
                                            description="Envío de un reporte detallado a tu correo."
                                            icon={Mail}
                                            active={settings.summaryEmail}
                                            onClick={() => toggleSetting('summaryEmail')}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-widest border-l-4 border-teal-dark pl-3">Apariencia</h2>
                                    <div className="bg-pure-white dark:bg-pure-white/5 p-6 rounded-3xl shadow-lg border border-light-teal/30 dark:border-pure-white/10 transition-colors">
                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { id: 'light', label: 'Claro', icon: Sun },
                                                { id: 'dark', label: 'Oscuro', icon: Moon },
                                                { id: 'system', label: 'Sistema', icon: Monitor }
                                            ].map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setTheme(t.id)}
                                                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${theme === t.id ? 'border-teal-dark bg-light-teal/20 dark:bg-teal-dark/20 text-teal-dark dark:text-light-teal' : 'border-light-teal/20 dark:border-pure-white/10 text-dark-blue/40 dark:text-pure-white/40 hover:border-light-teal hover:text-teal-dark dark:hover:text-pure-white'}`}
                                                >
                                                    <t.icon className="w-6 h-6" strokeWidth={2} />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">{t.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-widest border-l-4 border-teal-dark pl-3">Accesibilidad (Daltonismo)</h2>
                                    <div className="bg-pure-white dark:bg-pure-white/5 p-6 rounded-3xl shadow-lg border border-light-teal/30 dark:border-pure-white/10 transition-colors">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                            {[
                                                { id: 'none', label: 'Ninguno' },
                                                { id: 'protanopia', label: 'Protanopia' },
                                                { id: 'deuteranopia', label: 'Deuteranopia' },
                                                { id: 'tritanopia', label: 'Tritanopia' },
                                                { id: 'achromatopsia', label: 'Total' }
                                            ].map((d) => (
                                                <button
                                                    key={d.id}
                                                    onClick={() => setDaltonismType(d.id)}
                                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${daltonismType === d.id ? 'border-teal-dark bg-light-teal/20 dark:bg-teal-dark/20 text-teal-dark dark:text-light-teal' : 'border-light-teal/20 dark:border-pure-white/10 text-dark-blue/40 dark:text-pure-white/40 hover:border-light-teal hover:text-teal-dark dark:hover:text-pure-white'}`}
                                                >
                                                    <Droplet className={`w-5 h-5 mb-2 ${daltonismType === d.id ? 'fill-current' : ''}`} strokeWidth={2} />
                                                    <span className="text-[8px] font-black uppercase tracking-tighter text-center">{d.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-[9px] font-bold text-dark-blue/50 dark:text-pure-white/50 mt-4 text-center italic">
                                            Los filtros de daltonismo ajustan los colores de toda la interfaz para mejorar la visibilidad.
                                        </p>
                                    </div>
                                    
                                    {/* Nueva Opción: Escala de Grises */}
                                    <div className="mt-6">
                                        <SettingRow
                                            label="Escala de Grises"
                                            description="Convierte toda la interfaz a blanco y negro."
                                            icon={Droplet}
                                            active={isGrayscale}
                                            onClick={() => setIsGrayscale(!isGrayscale)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-widest border-l-4 border-teal-dark pl-3">Dispositivos y Wearables</h2>
                                    <div className="bg-pure-white dark:bg-pure-white/5 p-6 rounded-3xl shadow-lg border border-light-teal/30 dark:border-pure-white/10 transition-colors">
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="bg-light-teal/20 dark:bg-teal-dark/20 p-4 rounded-full text-teal-dark dark:text-light-teal mb-2">
                                                <Watch className="w-8 h-8" strokeWidth={2} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-dark-blue dark:text-pure-white text-sm">Vincular Smartwatch</h4>
                                                <p className="text-xs font-bold text-dark-blue/60 dark:text-pure-white/60 mt-1 leading-relaxed">
                                                    Conecta tu Apple Watch o Garmin para sincronizar pasos, ritmo cardíaco y calorías automáticamente.
                                                </p>
                                            </div>
                                            <Link 
                                                to="/vincular-dispositivo" 
                                                className="w-full bg-dark-blue text-pure-white dark:bg-teal-dark px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-dark dark:hover:bg-light-teal dark:hover:text-dark-blue transition-all shadow-md shadow-dark-blue/20"
                                            >
                                                Conectar Dispositivo
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Columna Derecha */}
                            <div className="space-y-8">
                                
                                <div className="space-y-6">
                                    <h2 className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-widest border-l-4 border-teal-dark pl-3">Privacidad y Datos</h2>
                                    <div className="space-y-3">
                                        <SettingRow
                                            label="Perfil Público"
                                            description="Permite que otros usuarios vean tus logros."
                                            icon={Lock}
                                            active={settings.publicProfile}
                                            onClick={() => toggleSetting('publicProfile')}
                                        />
                                        <SettingRow
                                            label="Compartir con Salud"
                                            description="Sincroniza datos con Apple Health o Fit."
                                            icon={Share2}
                                            active={settings.shareData}
                                            onClick={() => toggleSetting('shareData')}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-widest border-l-4 border-teal-dark dark:border-light-teal pl-3">Metas de Salud</h2>
                                    <div className="bg-pure-white dark:bg-pure-white/5 p-8 rounded-3xl shadow-lg border border-light-teal/30 dark:border-pure-white/10 space-y-8 transition-colors">
                                        
                                        {/* Meta de Agua */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center px-1">
                                                <div className="flex items-center gap-2 text-teal-dark dark:text-light-teal">
                                                    <Droplet className="w-4 h-4" strokeWidth={2.5} />
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-dark-blue/60 dark:text-pure-white/60">Vasos de Agua</label>
                                                </div>
                                                <span className="text-lg font-black text-teal-dark dark:text-light-teal">{settings.meta_agua_vasos}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="20"
                                                step="1"
                                                value={settings.meta_agua_vasos}
                                                onChange={(e) => handleInput('meta_agua_vasos', parseInt(e.target.value))}
                                                className="w-full h-2 bg-light-teal/30 dark:bg-pure-white/10 rounded-lg appearance-none cursor-pointer accent-teal-dark dark:accent-light-teal"
                                            />
                                        </div>

                                        {/* Meta de Sueño */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center px-1">
                                                <div className="flex items-center gap-2 text-teal-dark dark:text-light-teal">
                                                    <MoonIcon className="w-4 h-4" strokeWidth={2.5} />
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-dark-blue/60 dark:text-pure-white/60">Horas de Sueño</label>
                                                </div>
                                                <span className="text-lg font-black text-teal-dark dark:text-light-teal">{settings.meta_sueno_horas} hrs</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="4"
                                                max="12"
                                                step="0.5"
                                                value={settings.meta_sueno_horas}
                                                onChange={(e) => handleInput('meta_sueno_horas', parseFloat(e.target.value))}
                                                className="w-full h-2 bg-light-teal/30 dark:bg-pure-white/10 rounded-lg appearance-none cursor-pointer accent-teal-dark dark:accent-light-teal"
                                            />
                                        </div>

                                        {/* Meta de Ejercicio */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center px-1">
                                                <div className="flex items-center gap-2 text-teal-dark dark:text-light-teal">
                                                    <Activity className="w-4 h-4" strokeWidth={2.5} />
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-dark-blue/60 dark:text-pure-white/60">Ejercicio Diario</label>
                                                </div>
                                                <span className="text-lg font-black text-teal-dark dark:text-light-teal">{settings.meta_ejercicio_minutos} min</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="10"
                                                max="180"
                                                step="5"
                                                value={settings.meta_ejercicio_minutos}
                                                onChange={(e) => handleInput('meta_ejercicio_minutos', parseInt(e.target.value))}
                                                className="w-full h-2 bg-light-teal/30 dark:bg-pure-white/10 rounded-lg appearance-none cursor-pointer accent-teal-dark dark:accent-light-teal"
                                            />
                                        </div>

                                        {/* Botón Guardar Metas */}
                                        <div className="pt-6 border-t border-light-teal/30 dark:border-pure-white/10">
                                            <button
                                                onClick={handleSaveMetas}
                                                disabled={isSaving}
                                                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2
                                                    ${isSaving 
                                                        ? 'bg-dark-blue/50 text-pure-white/80 cursor-not-allowed' 
                                                        : 'bg-dark-blue text-pure-white hover:bg-teal-dark shadow-lg hover:shadow-teal-dark/20 active:scale-95 dark:bg-light-teal dark:text-dark-blue dark:hover:bg-teal-dark dark:hover:text-pure-white'
                                                    }`}
                                            >
                                                {isSaving ? 'Guardando...' : 'Guardar Todo'}
                                                {!isSaving && <CheckCircle2 className="w-4 h-4" strokeWidth={3} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preferences & Units (Fondo Degradado que sí respeta tu paleta) */}
                        <div className="bg-gradient-to-br from-dark-blue to-teal-dark rounded-3xl p-8 text-pure-white relative overflow-hidden group shadow-xl">
                            <Settings className="absolute top-4 right-4 w-32 h-32 text-pure-white/5 group-hover:rotate-90 transition-transform duration-1000" strokeWidth={1} />
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">Preferencias de Unidades</h3>
                                    <p className="text-pure-white/80 font-bold text-sm mt-2">Afecta cómo se visualizan tus métricas en toda la app.</p>
                                </div>
                                <div className="flex bg-pure-white/10 p-1.5 rounded-2xl gap-2 backdrop-blur-sm border border-pure-white/20">
                                    {['metrico', 'imperial'].map((u) => (
                                        <button
                                            key={u}
                                            onClick={() => handleInput('units', u)}
                                            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${settings.units === u ? 'bg-pure-white text-dark-blue shadow-lg' : 'text-pure-white/60 hover:text-pure-white hover:bg-pure-white/10'}`}
                                        >
                                            {u === 'metrico' ? 'Métrico (kg/cm)' : 'Imperial (lb/ft)'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
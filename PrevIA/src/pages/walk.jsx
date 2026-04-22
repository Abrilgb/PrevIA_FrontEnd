import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../layouts/sidebar';
import Breadcrumbs from '../layouts/breadcrums'; // <-- IMPORTACIÓN DE BREADCRUMBS
import { SkeletonPageHeader, SkeletonFormCard } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';

// Importamos los iconos de Lucide
import { Activity, Clock, Zap, Target, CheckCircle2, ChevronDown, Lightbulb, Droplets } from 'lucide-react';

export default function Walk() {
    const [formData, setFormData] = useState({
        tipoEjercicio: 'Caminar',
        duracionMinutos: '',
        intensidad: 'Media'
    });
    
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Referencia para arreglar el scroll y la pantalla "chiquita"
    const scrollRef = useRef(null);

    const { toast } = useToast();
    const { notify } = useNotifications();

    // Asegurarnos de que inicie hasta arriba al cargar la pantalla
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo(0, 0);
        }
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(t);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.duracionMinutos || formData.duracionMinutos <= 0) {
            toast.error('Por favor, ingresa una duración válida.');
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('tokenPrevia');

        try {
            const response = await fetch('http://localhost:3000/api/actividad', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fecha: new Date().toISOString(),
                    tipoEjercicio: formData.tipoEjercicio,
                    duracionMinutos: parseInt(formData.duracionMinutos),
                    intensidad: formData.intensidad
                })
            });

            if (response.ok) {
                setIsSaved(true);
                toast.success('¡Actividad registrada!', '¡Buen trabajo!');
                notify({
                    type: 'success',
                    title: '¡Actividad completada!',
                    message: `${formData.tipoEjercicio} • ${formData.duracionMinutos} min • Intensidad ${formData.intensidad}.`,
                    icon: '🏃', 
                });

                try {
                    await fetch('http://localhost:3000/api/rachas', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            habito: "ejercicio", 
                            fechaActualizacion: new Date().toISOString()
                        })
                    });
                } catch(err) {
                    console.error('Error al actualizar racha de ejercicio:', err);
                }
                
                setFormData(prev => ({ ...prev, duracionMinutos: '' }));
                setTimeout(() => setIsSaved(false), 3000);
            } else {
                toast.error('Hubo un error al guardar tu actividad.');
            }
        } catch (error) {
            console.error('Error de red:', error);
            toast.error('No se pudo conectar con el servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sidebar>
            {/* Contenedor principal: min-h-screen evita que se haga chiquita y bg-transparent quita el recuadro */}
            <div className="flex flex-col flex-1 w-full min-h-screen relative bg-transparent">
                
                {/* --- 1. BARRA DE BREADCRUMBS (Sin fondo blanco, limpia) --- */}
                <div className="w-full pt-2 pb-6 z-40 px-2 lg:px-4">
                    <Breadcrumbs />
                </div>

                {/* --- 2. CONTENIDO DE ACTIVIDAD --- */}
                {/* Añadimos el scrollRef aquí */}
                <div ref={scrollRef} className="flex-1 w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="w-full max-w-4xl mx-auto space-y-6 lg:space-y-8 font-[Manrope] animate-in fade-in duration-700 pb-16 px-6 lg:px-8">
                        
                        {isLoading ? (
                            <>
                                <SkeletonPageHeader />
                                <SkeletonFormCard />
                            </>
                        ) : (
                        <>
                        {/* Header Dinámico */}
                        <div className="px-1 flex items-center gap-4 transition-colors">
                            <div className="bg-teal-dark/10 dark:bg-light-teal/10 p-3 rounded-2xl transition-colors">
                                <Activity className="w-8 h-8 text-teal-dark dark:text-light-teal" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-dark-blue dark:text-pure-white tracking-tight transition-colors">Registro de Actividad</h1>
                                <p className="text-dark-blue/60 dark:text-pure-white/60 font-medium mt-1 transition-colors">Lleva un control detallado de tu esfuerzo físico diario.</p>
                            </div>
                        </div>

                        {/* Form Card (Con sombra fuerte para modo claro) */}
                        <div className="bg-pure-white dark:bg-slate-800 p-6 sm:p-10 rounded-3xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-700 relative overflow-hidden transition-colors">
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-light-teal/10 dark:bg-pure-white/5 rounded-full blur-3xl opacity-50 transition-colors"></div>

                            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    
                                    {/* Activity Type */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-wider ml-1 flex items-center gap-2 transition-colors">
                                            <Activity className="w-4 h-4 text-teal-dark dark:text-light-teal" /> Tipo de Actividad
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="tipoEjercicio"
                                                value={formData.tipoEjercicio}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 font-bold text-dark-blue dark:text-pure-white outline-none focus:border-teal-dark dark:focus:border-light-teal transition-all appearance-none cursor-pointer"
                                            >
                                                <option className="bg-pure-white dark:bg-slate-800 text-dark-blue dark:text-pure-white">Caminar</option>
                                                <option className="bg-pure-white dark:bg-slate-800 text-dark-blue dark:text-pure-white">Correr</option>
                                                <option className="bg-pure-white dark:bg-slate-800 text-dark-blue dark:text-pure-white">Ciclismo</option>
                                                <option className="bg-pure-white dark:bg-slate-800 text-dark-blue dark:text-pure-white">Natación</option>
                                                <option className="bg-pure-white dark:bg-slate-800 text-dark-blue dark:text-pure-white">Gimnasio</option>
                                                <option className="bg-pure-white dark:bg-slate-800 text-dark-blue dark:text-pure-white">Yoga</option>
                                                <option className="bg-pure-white dark:bg-slate-800 text-dark-blue dark:text-pure-white">Otro</option>
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-teal-dark dark:text-light-teal transition-colors">
                                                <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-wider ml-1 flex items-center gap-2 transition-colors">
                                            <Clock className="w-4 h-4 text-teal-dark dark:text-light-teal" /> Duración (Minutos)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="duracionMinutos"
                                                required
                                                min="1"
                                                placeholder="Ej: 45"
                                                value={formData.duracionMinutos}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 font-bold text-dark-blue dark:text-pure-white outline-none focus:border-teal-dark dark:focus:border-light-teal transition-all placeholder:text-dark-blue/20 dark:placeholder:text-pure-white/20"
                                            />
                                            <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-dark-blue/30 dark:text-pure-white/30 text-sm transition-colors">MIN</span>
                                        </div>
                                    </div>

                                    {/* Intensity */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-wider ml-1 flex items-center gap-2 transition-colors">
                                            <Zap className="w-4 h-4 text-teal-dark dark:text-light-teal" /> Intensidad
                                        </label>
                                        <div className="flex bg-slate-50 dark:bg-slate-900 p-1.5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 gap-2 transition-colors">
                                            {['Baja', 'Media', 'Alta'].map((lvl) => (
                                                <button
                                                    key={lvl}
                                                    type="button"
                                                    onClick={() => setFormData(p => ({ ...p, intensidad: lvl }))}
                                                    className={`flex-1 py-3 px-2 rounded-xl font-black text-xs uppercase tracking-tighter transition-all ${
                                                        formData.intensidad === lvl
                                                        ? 'bg-dark-blue text-pure-white shadow-md scale-105 dark:bg-teal-dark dark:text-pure-white'
                                                        : 'text-dark-blue/40 hover:bg-slate-200 dark:text-pure-white/40 dark:hover:bg-slate-800'
                                                    }`}
                                                >
                                                    {lvl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Meta Visual (Placeholder) */}
                                    <div className="flex items-center justify-center">
                                        <div className="w-full flex items-center gap-4 bg-light-teal/10 dark:bg-slate-900 px-6 py-4 rounded-3xl border border-light-teal/20 dark:border-slate-700 transition-colors">
                                            <div className="bg-light-teal dark:bg-teal-dark/20 text-teal-dark dark:text-light-teal rounded-2xl p-3 shadow-sm transition-colors">
                                                <Target className="w-6 h-6" strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[10px] font-black text-teal-dark dark:text-light-teal uppercase tracking-widest leading-none transition-colors">Meta Semanal</div>
                                                <div className="text-sm font-bold text-dark-blue dark:text-pure-white mt-1 transition-colors">150 min <span className="text-dark-blue/40 dark:text-pure-white/40 font-medium">/ 60% completo</span></div>
                                                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden transition-colors">
                                                    <div className="h-full bg-teal-dark dark:bg-light-teal rounded-full transition-colors" style={{ width: '60%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button & Success Message */}
                                <div className="pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-6 transition-colors">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3
                                            ${isSubmitting 
                                                ? 'bg-dark-blue/50 text-pure-white/80 cursor-not-allowed dark:bg-slate-700 dark:text-pure-white/50' 
                                                : 'bg-dark-blue text-pure-white hover:bg-teal-dark shadow-xl hover:shadow-teal-dark/20 transform hover:-translate-y-1 active:scale-95 dark:bg-light-teal dark:text-dark-blue dark:hover:bg-teal-dark dark:hover:text-pure-white'
                                            }`}
                                    >
                                        <span>{isSubmitting ? 'Guardando...' : 'Guardar Actividad'}</span>
                                        {!isSubmitting && <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />}
                                    </button>

                                    {isSaved && (
                                        <div className="flex items-center gap-3 text-teal-dark dark:text-light-teal animate-in slide-in-from-left duration-500">
                                            <div className="bg-teal-dark/10 dark:bg-light-teal/10 text-teal-dark dark:text-light-teal p-2 rounded-xl shadow-sm transition-colors">
                                                <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
                                            </div>
                                            <span className="font-black text-xs uppercase tracking-wider">¡Guardado con éxito!</span>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Quick Tips */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
                            <div className="bg-gradient-to-br from-light-teal/10 to-teal-dark/5 dark:from-slate-800 dark:to-slate-800/50 p-6 rounded-3xl border border-light-teal/20 dark:border-slate-700 flex gap-4 items-start group hover:border-light-teal dark:hover:border-teal-dark transition-all">
                                <Lightbulb className="w-8 h-8 text-amber-500 filter group-hover:scale-110 transition-transform flex-shrink-0" strokeWidth={1.5} />
                                <div>
                                    <h4 className="font-black text-dark-blue dark:text-pure-white text-xs uppercase tracking-wider transition-colors">Tip de Intensidad</h4>
                                    <p className="text-dark-blue/60 dark:text-pure-white/60 text-xs font-bold mt-2 leading-relaxed transition-colors">
                                        La intensidad "Media" es ideal para quemar grasa. Deberías poder hablar pero no cantar.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-dark-blue/5 to-teal-dark/5 dark:from-slate-800 dark:to-slate-800/50 p-6 rounded-3xl border border-dark-blue/5 dark:border-slate-700 flex gap-4 items-start group hover:border-dark-blue/20 dark:hover:border-teal-dark transition-all">
                                <Droplets className="w-8 h-8 text-blue-400 filter group-hover:scale-110 transition-transform flex-shrink-0" strokeWidth={1.5} />
                                <div>
                                    <h4 className="font-black text-dark-blue dark:text-pure-white text-xs uppercase tracking-wider transition-colors">Recordatorio</h4>
                                    <p className="text-dark-blue/60 dark:text-pure-white/60 text-xs font-bold mt-2 leading-relaxed transition-colors">
                                        Bebe al menos 500ml de agua inmediatamente después de terminar tu registro.
                                    </p>
                                </div>
                            </div>
                        </div>
                        </>)}
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
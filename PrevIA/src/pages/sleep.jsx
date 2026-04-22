import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../layouts/sidebar';
import Breadcrumbs from '../layouts/breadcrums'; // <-- IMPORTACIÓN DEL BREADCRUMB
import PageHeader from '../components/ui/PageHeader';
import SectionTitle from '../components/ui/SectionTitle';
import InputField from '../components/ui/InputField';
import TipCard from '../components/ui/TipCard';
import { SkeletonPageHeader, SkeletonFormCard } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';

import { Moon, Frown, Meh, Smile, Zap, Sparkles, Coffee, CheckCircle2 } from 'lucide-react';

export default function Sleep() {
    const [formData, setFormData] = useState({
        sleepTime: '22:00',
        wakeTime: '07:00',
        quality: 3, 
        mood: 3, 
        notes: ''
    });
    
    const [duration, setDuration] = useState('9h 0m');
    const [numericDuration, setNumericDuration] = useState(9.0); 
    
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Referencia para arreglar el scroll y la pantalla "chiquita"
    const scrollRef = useRef(null);

    const { toast } = useToast();
    const { notify } = useNotifications();

    const moods = [
        { label: 'Cansado', value: 1, icon: Frown },
        { label: 'Normal', value: 2, icon: Meh },
        { label: 'Energético', value: 3, icon: Smile },
        { label: 'Motivado', value: 4, icon: Zap },
        { label: 'Relajado', value: 5, icon: Sparkles }
    ];

    // Asegurarnos de que inicie hasta arriba al cargar la pantalla
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo(0, 0);
        }
    }, []);

    useEffect(() => {
        calculateDuration();
    }, [formData.sleepTime, formData.wakeTime]);

    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(t);
    }, []);

    const calculateDuration = () => {
        if (!formData.sleepTime || !formData.wakeTime) return;

        const [sHours, sMins] = formData.sleepTime.split(':').map(Number);
        const [wHours, wMins] = formData.wakeTime.split(':').map(Number);

        let diffHours = wHours - sHours;
        let diffMins = wMins - sMins;

        if (diffHours < 0 || (diffHours === 0 && diffMins < 0)) {
            diffHours += 24;
        }

        if (diffMins < 0) {
            diffMins += 60;
            diffHours -= 1;
        }

        setDuration(`${diffHours}h ${diffMins}m`);
        setNumericDuration(diffHours + (diffMins / 60));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem('tokenPrevia');

        try {
            const response = await fetch('http://localhost:3000/api/sueno', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fecha: new Date().toISOString(), 
                    horasDormidas: numericDuration,
                    calidad: parseInt(formData.quality),
                    horaAcostarse: formData.sleepTime,
                    horaDespertar: formData.wakeTime
                })
            });

            if (response.ok) {
                setIsSaved(true);
                toast.success('Registro guardado correctamente.', '¡Excelente!');
                notify({
                    type: 'success',
                    title: 'Sueño registrado',
                    message: `Dormiste ${duration}. ¡Sigue así para mejorar tu descanso!`,
                    icon: '🌙', 
                });

                try {
                    await fetch('http://localhost:3000/api/rachas', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            habito: "sueño", 
                            fechaActualizacion: new Date().toISOString()
                        })
                    });
                } catch(err) {
                    console.error('Error al actualizar racha de sueño:', err);
                }

                setTimeout(() => setIsSaved(false), 3000);
            } else if (response.status === 409) {
                toast.error('Ya guardaste tu registro de sueño de hoy.');
            } else {
                toast.error('Error al guardar el registro en la base de datos.');
            }
        } catch (error) {
            console.error('Error de red:', error);
            toast.error('Error de conexión con el servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sidebar>
            {/* Contenedor principal: min-h-screen evita que se haga chiquita y bg-transparent quita el recuadro */}
            <div className="flex flex-col flex-1 w-full min-h-screen relative bg-transparent">
                
                {/* --- 1. BARRA DE BREADCRUMBS (Limpia y transparente) --- */}
                <div className="w-full pt-2 pb-6 z-40 px-2 lg:px-4">
                    <Breadcrumbs />
                </div>

                {/* --- 2. CONTENIDO DEL REGISTRO DE SUEÑO --- */}
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
                        <PageHeader title="Registro de Sueño" subtitle="Analiza tu descanso para mejorar tu rendimiento diario.">
                            {/* Card de cabecera con sombra y gradiente */}
                            <div className="bg-gradient-to-br from-dark-blue to-teal-dark dark:from-slate-700 dark:to-slate-600 px-6 py-4 rounded-3xl shadow-xl text-pure-white flex items-center gap-4 transition-colors">
                                <Moon className="w-8 h-8 animate-pulse text-pure-white/90" strokeWidth={1.5} />
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Duración Total</div>
                                    <div className="text-2xl font-black">{duration}</div>
                                </div>
                            </div>
                        </PageHeader>

                        {/* Form Card (Con sombra fuerte para modo claro) */}
                        <div className="bg-pure-white dark:bg-slate-800 p-6 sm:p-10 rounded-3xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-700 relative overflow-hidden transition-colors">
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-60 h-60 bg-dark-blue/5 dark:bg-pure-white/5 rounded-full blur-3xl transition-colors"></div>

                            <form onSubmit={handleSave} className="relative z-10 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    
                                    <div className="space-y-6">
                                        <SectionTitle>Horario</SectionTitle>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField
                                                label="Me dormí a las"
                                                type="time"
                                                name="sleepTime"
                                                value={formData.sleepTime}
                                                onChange={handleChange}
                                            />
                                            <InputField
                                                label="Desperté a las"
                                                type="time"
                                                name="wakeTime"
                                                value={formData.wakeTime}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="space-y-4 pt-2">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-dark-blue/60 dark:text-pure-white/70 uppercase tracking-wider transition-colors">Calidad del Sueño</label>
                                                <span className="text-sm font-black text-teal-dark dark:text-light-teal transition-colors">{formData.quality}/5</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="5"
                                                name="quality"
                                                value={formData.quality}
                                                onChange={handleChange}
                                                className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-dark-blue dark:accent-light-teal transition-colors"
                                            />
                                            <div className="flex justify-between text-[10px] font-bold text-dark-blue/40 dark:text-pure-white/50 px-1 transition-colors">
                                                <span>Mala (1)</span>
                                                <span>Regular (3)</span>
                                                <span>Excelente (5)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <SectionTitle>Humor al despertar</SectionTitle>
                                        <div className="flex flex-wrap gap-3">
                                            {moods.map((m) => {
                                                const IconComponent = m.icon;
                                                const isSelected = formData.mood === m.value;
                                                return (
                                                    <button
                                                        key={m.label}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, mood: m.value }))}
                                                        className={`flex-1 min-w-[100px] py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                                                            isSelected
                                                                ? 'bg-dark-blue border-dark-blue text-pure-white shadow-lg shadow-dark-blue/20 scale-105 dark:bg-teal-dark dark:border-teal-dark dark:shadow-teal-dark/20'
                                                                : 'bg-slate-50 border-slate-100 text-dark-blue/60 hover:border-light-teal/30 hover:bg-white hover:text-dark-blue/80 dark:bg-slate-900 dark:border-slate-700 dark:text-pure-white/60 dark:hover:border-light-teal/30 dark:hover:bg-slate-800 dark:hover:text-pure-white'
                                                        }`}
                                                    >
                                                        <IconComponent 
                                                            className={`w-6 h-6 transition-transform ${isSelected ? 'scale-110 text-pure-white' : 'group-hover:scale-110'}`} 
                                                            strokeWidth={isSelected ? 2.5 : 2}
                                                        />
                                                        <span className="text-[10px] font-black uppercase tracking-tighter">{m.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <InputField
                                            label="Notas del Sueño (Opcional)"
                                            type="textarea"
                                            name="notes"
                                            placeholder="¿Recordaste algún sueño? ¿Te despertaste durante la noche?"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            rows={2}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-6 transition-colors">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full sm:w-auto px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3
                                            ${isSubmitting 
                                                ? 'bg-dark-blue/50 text-pure-white/80 cursor-not-allowed dark:bg-slate-700 dark:text-pure-white/50' 
                                                : 'bg-dark-blue text-pure-white hover:bg-teal-dark shadow-xl hover:shadow-teal-dark/20 transform hover:-translate-y-1 active:scale-95 dark:bg-light-teal dark:text-dark-blue dark:hover:bg-teal-dark dark:hover:text-pure-white'
                                            }`}
                                    >
                                        <span>{isSubmitting ? 'Guardando...' : 'Guardar Registro'}</span>
                                        {!isSubmitting && (
                                            <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
                                        )}
                                    </button>

                                    {isSaved && (
                                        <div className="flex items-center gap-3 text-teal-dark dark:text-light-teal animate-in zoom-in slide-in-from-left-4 duration-300">
                                            <div className="bg-teal-dark/10 dark:bg-light-teal/10 p-2 rounded-xl text-teal-dark dark:text-light-teal transition-colors">
                                                <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <div className="font-black text-[10px] uppercase tracking-wider leading-none">¡Excelente!</div>
                                                <div className="text-xs font-bold text-dark-blue/60 dark:text-pure-white/60 mt-1 transition-colors">Registro guardado correctamente.</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
                            <TipCard
                                emoji={<Zap className="w-5 h-5 text-indigo-500" />} 
                                title="Higiene del Sueño"
                                description="Evita pantallas azules 30 minutos antes de dormir para aumentar la producción de melatonina."
                                gradient="from-indigo-50 to-indigo-100/30 border-indigo-100 dark:from-indigo-500/10 dark:to-indigo-500/5 dark:border-indigo-500/20 shadow-sm"
                            />
                            <TipCard
                                emoji={<Coffee className="w-5 h-5 text-amber-600" />} 
                                title="Cafeína"
                                description="Tu última taza de café debería ser al menos 6 horas antes de tu hora prevista de dormir."
                                gradient="from-amber-50 to-amber-100/30 border-amber-100 dark:from-amber-500/10 dark:to-amber-500/5 dark:border-amber-500/20 shadow-sm"
                            />
                        </div>
                        </>)}
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../layouts/sidebar';
import Breadcrumbs from '../layouts/breadcrums'; // <-- BREADCRUMBS
import { SkeletonPageHeader, SkeletonFormCard } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';

// Iconos profesionales de Lucide
import { Droplet, Plus, Minus, Smile, Meh, Frown, CloudRain, Zap, CheckCircle2, Brain, HeartPulse } from 'lucide-react';

export default function Bienestar() {
    const [formData, setFormData] = useState({
        vasosAgua: 0,
        estadoAnimo: 'Normal',
        nivelEstres: 3
    });
    
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Referencia para arreglar el scroll y la pantalla "chiquita"
    const scrollRef = useRef(null);

    const { toast } = useToast();
    const { notify } = useNotifications();

    const estadosAnimo = [
        { label: 'Feliz', icon: Smile },
        { label: 'Normal', icon: Meh },
        { label: 'Triste', icon: CloudRain },
        { label: 'Enojado', icon: Frown },
        { label: 'Ansioso', icon: Zap }
    ];

    // Asegurarnos de que inicie hasta arriba al cargar la pantalla
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo(0, 0);
        }
    }, []);

    // --- SOLUCIÓN DE LOS VASOS DE AGUA ---
    // Cargamos los datos de HOY al iniciar, así el contador no empieza en 0 si ya bebió agua
    useEffect(() => {
        const cargarDatosHoy = async () => {
            const token = localStorage.getItem('tokenPrevia');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/bienestar/historial', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    const hoy = new Date().toISOString().split('T')[0];
                    
                    // Buscamos si ya hay un registro con la fecha de hoy
                    const registroHoy = data.find(b => b.fecha.startsWith(hoy));

                    if (registroHoy) {
                        setFormData({
                            vasosAgua: registroHoy.vasos_agua_consumidos || 0,
                            estadoAnimo: registroHoy.estado_animo || 'Normal',
                            nivelEstres: registroHoy.nivel_estres || 3
                        });
                    }
                }
            } catch (error) {
                console.error("Error al cargar datos de hoy:", error);
            } finally {
                setIsLoading(false);
            }
        };

        cargarDatosHoy();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddWater = () => {
        setFormData(prev => ({ ...prev, vasosAgua: prev.vasosAgua + 1 }));
    };

    const handleRemoveWater = () => {
        setFormData(prev => ({ ...prev, vasosAgua: prev.vasosAgua > 0 ? prev.vasosAgua - 1 : 0 }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem('tokenPrevia');

        try {
            const response = await fetch('http://localhost:3000/api/bienestar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fecha: new Date().toISOString(),
                    vasosAgua: parseInt(formData.vasosAgua),
                    estadoAnimo: formData.estadoAnimo,
                    nivelEstres: parseInt(formData.nivelEstres)
                })
            });

            if (response.ok) {
                setIsSaved(true);
                toast.success('¡Bienestar registrado con éxito!', 'Gran trabajo');
                notify({
                    type: 'success',
                    title: 'Registro Completo',
                    message: `Has registrado ${formData.vasosAgua} vasos de agua en total hoy.`,
                    icon: '💧', 
                });

                try {
                    await fetch('http://localhost:3000/api/rachas', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            habito: "bienestar", 
                            fechaActualizacion: new Date().toISOString()
                        })
                    });
                } catch(err) {
                    console.error('Error al actualizar racha de bienestar:', err);
                }
                
                setTimeout(() => setIsSaved(false), 3000);
            } else if (response.status === 409) {
                toast.error('Ya registraste tu bienestar del día de hoy.');
            } else {
                toast.error('Hubo un error al guardar tu registro.');
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
                
                {/* --- 1. BARRA DE BREADCRUMBS --- */}
                <div className="w-full pt-2 pb-6 z-40 px-2 lg:px-4">
                    <Breadcrumbs />
                </div>

                {/* --- 2. CONTENIDO DE BIENESTAR --- */}
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
                        {/* Header */}
                        <div className="px-1 flex items-center gap-4 transition-colors">
                            <div className="bg-teal-dark/10 dark:bg-light-teal/10 p-3 rounded-2xl transition-colors">
                                <Droplet className="w-8 h-8 text-teal-dark dark:text-light-teal" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-dark-blue dark:text-pure-white tracking-tight transition-colors">Bienestar Diario</h1>
                                <p className="text-dark-blue/60 dark:text-pure-white/60 font-medium mt-1 transition-colors">Registra tu hidratación y estado mental.</p>
                            </div>
                        </div>

                        {/* Form Card (Con sombra fuerte para modo claro) */}
                        <div className="bg-pure-white dark:bg-slate-800 p-6 sm:p-10 rounded-3xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-700 relative overflow-hidden transition-colors">
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-light-teal/20 dark:bg-light-teal/5 rounded-full blur-3xl opacity-60 transition-colors"></div>

                            <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                    
                                    {/* Sección Agua (Izquierda) */}
                                    <div className="md:col-span-5 space-y-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border-2 border-slate-100 dark:border-slate-700 transition-colors">
                                        <h3 className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-widest transition-colors">Vasos de Agua</h3>
                                        
                                        <div className="flex items-center gap-6 my-4">
                                            <button 
                                                type="button" 
                                                onClick={handleRemoveWater}
                                                className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center text-dark-blue dark:text-pure-white hover:border-teal-dark dark:hover:border-light-teal hover:text-teal-dark dark:hover:text-light-teal transition-all active:scale-95 shadow-sm"
                                            >
                                                <Minus className="w-6 h-6" strokeWidth={3} />
                                            </button>
                                            
                                            <div className="flex flex-col items-center w-24">
                                                <span className="text-6xl font-black text-teal-dark dark:text-light-teal tracking-tighter transition-colors">
                                                    {formData.vasosAgua}
                                                </span>
                                            </div>

                                            <button 
                                                type="button" 
                                                onClick={handleAddWater}
                                                className="w-12 h-12 rounded-full dark:bg-teal-dark border-2 border-teal-dark dark:border-light-teal flex items-center justify-center dark:text-white text-dark-blue hover:opacity-90 transition-all active:scale-95 shadow-md shadow-teal-dark/20 dark:shadow-light-teal/20"
                                            >
                                                <Plus className="w-6 h-6" strokeWidth={3} />
                                            </button>
                                        </div>
                                        <p className="text-xs font-bold text-dark-blue/40 dark:text-pure-white/40 uppercase tracking-widest transition-colors">Meta recomendada: 8</p>
                                    </div>

                                    {/* Sección Mente (Derecha) */}
                                    <div className="md:col-span-7 space-y-8">
                                        
                                        {/* Estado de Ánimo */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-widest border-l-4 border-teal-dark dark:border-light-teal pl-3 transition-colors">¿Cómo te sientes hoy?</h3>
                                            <div className="flex flex-wrap gap-3 pt-2">
                                                {estadosAnimo.map((estado) => {
                                                    const IconComponent = estado.icon;
                                                    const isSelected = formData.estadoAnimo === estado.label;
                                                    return (
                                                        <button
                                                            key={estado.label}
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, estadoAnimo: estado.label }))}
                                                            className={`flex-1 min-w-[90px] py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                                                                isSelected
                                                                    ? 'bg-dark-blue border-dark-blue text-pure-white shadow-lg shadow-dark-blue/20 scale-105 dark:bg-teal-dark dark:border-teal-dark'
                                                                    : 'bg-slate-50 border-slate-100 text-dark-blue/40 hover:border-light-teal hover:bg-white hover:text-teal-dark dark:bg-slate-900 dark:border-slate-700 dark:text-pure-white/40 dark:hover:border-teal-dark/50 dark:hover:bg-slate-800 dark:hover:text-pure-white'
                                                            }`}
                                                        >
                                                            <IconComponent 
                                                                className={`w-6 h-6 transition-transform ${isSelected ? 'scale-110 text-pure-white' : 'group-hover:scale-110'}`} 
                                                                strokeWidth={isSelected ? 2.5 : 2}
                                                            />
                                                            <span className="text-[10px] font-black uppercase tracking-tighter">{estado.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Nivel de Estrés */}
                                        <div className="space-y-4 pt-4">
                                            <div className="flex justify-between items-center px-1">
                                                <h3 className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-widest border-l-4 border-teal-dark dark:border-light-teal pl-3 transition-colors">Nivel de Estrés</h3>
                                                <span className={`text-sm font-black px-3 py-1 rounded-lg transition-colors ${
                                                    formData.nivelEstres <= 2 ? 'bg-light-teal/20 text-teal-dark dark:bg-light-teal/10 dark:text-light-teal' :
                                                    formData.nivelEstres === 3 ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
                                                    'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                                                }`}>
                                                    {formData.nivelEstres}/5
                                                </span>
                                            </div>
                                            <div className="px-1 pt-2">
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="5"
                                                    name="nivelEstres"
                                                    value={formData.nivelEstres}
                                                    onChange={handleChange}
                                                    className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-dark dark:accent-light-teal transition-colors"
                                                />
                                                <div className="flex justify-between text-[10px] font-bold text-dark-blue/40 dark:text-pure-white/40 mt-2 transition-colors">
                                                    <span>Muy Relajado (1)</span>
                                                    <span>Estrés Medio (3)</span>
                                                    <span>Muy Estresado (5)</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* Botón Guardar */}
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
                                        <span>{isSubmitting ? 'Guardando...' : 'Guardar Bienestar'}</span>
                                        {!isSubmitting && <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />}
                                    </button>

                                    {isSaved && (
                                        <div className="flex items-center gap-3 text-teal-dark dark:text-light-teal animate-in slide-in-from-left duration-500">
                                            <div className="bg-teal-dark/10 dark:bg-light-teal/10 p-2 rounded-xl transition-colors">
                                                <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
                                            </div>
                                            <span className="font-black text-xs uppercase tracking-wider">¡Datos guardados!</span>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Quick Tips */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
                            <div className="bg-gradient-to-br from-light-teal/10 to-teal-dark/5 dark:from-slate-800 dark:to-slate-800/50 p-6 rounded-3xl border border-light-teal/20 dark:border-slate-700 flex gap-4 items-start group hover:border-light-teal dark:hover:border-teal-dark transition-all">
                                <Brain className="w-8 h-8 text-amber-500 filter group-hover:scale-110 transition-transform flex-shrink-0" strokeWidth={1.5} />
                                <div>
                                    <h4 className="font-black text-dark-blue dark:text-pure-white text-xs uppercase tracking-wider transition-colors">Gestión del Estrés</h4>
                                    <p className="text-dark-blue/60 dark:text-pure-white/60 text-xs font-bold mt-2 leading-relaxed transition-colors">
                                        Si tu nivel de estrés es 4 o 5, PrevIA te recomendará ejercicios de respiración corta en tu panel principal.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-dark-blue/5 to-teal-dark/5 dark:from-slate-800 dark:to-slate-800/50 p-6 rounded-3xl border border-dark-blue/5 dark:border-slate-700 flex gap-4 items-start group hover:border-dark-blue/20 dark:hover:border-teal-dark transition-all">
                                <HeartPulse className="w-8 h-8 text-teal-dark dark:text-light-teal filter group-hover:scale-110 transition-transform flex-shrink-0" strokeWidth={1.5} />
                                <div>
                                    <h4 className="font-black text-dark-blue dark:text-pure-white text-xs uppercase tracking-wider transition-colors">El impacto del Agua</h4>
                                    <p className="text-dark-blue/60 dark:text-pure-white/60 text-xs font-bold mt-2 leading-relaxed transition-colors">
                                        Incluso una deshidratación leve (1-2%) puede afectar negativamente tu estado de ánimo y tu concentración.
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
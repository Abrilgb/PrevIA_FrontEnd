import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../layouts/sidebar';
import Breadcrumbs from '../layouts/breadcrums'; // <-- BREADCRUMBS IMPORTADO AQUÍ
import { SkeletonPageHeader, SkeletonFormCard } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
// Importamos iconos Lucide
import { Utensils, Clock, Apple, Coffee, CheckCircle2, CupSoda } from 'lucide-react';

export default function Nutricion() {
    // Estado alineado a tu backend de Node.js
    const [formData, setFormData] = useState({
        tipoComida: 'Desayuno',
        descripcionCorta: '',
    });
    
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Referencia para arreglar el scroll y la pantalla "chiquita"
    const scrollRef = useRef(null);

    const { toast } = useToast();
    const { notify } = useNotifications();

    const tiposComida = [
        { label: 'Desayuno', icon: Coffee },
        { label: 'Almuerzo / Comida', icon: Utensils },
        { label: 'Cena', icon: CupSoda }, 
        { label: 'Snack / Colación', icon: Apple }
    ];

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

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!formData.descripcionCorta.trim()) {
            toast.error('Por favor describe qué comiste.');
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('tokenPrevia');

        // Capturamos la hora actual en formato "HH:mm"
        const now = new Date();
        const horaActual = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

        try {
            const response = await fetch('http://localhost:3000/api/alimentacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fecha: new Date().toISOString(),
                    tipoComida: formData.tipoComida,
                    descripcionCorta: formData.descripcionCorta,
                    horaRegistro: horaActual
                })
            });

            if (response.ok) {
                setIsSaved(true);
                toast.success('Comida registrada correctamente.', '¡Perfecto!');
                notify({
                    type: 'success',
                    title: 'Nutrición registrada',
                    message: `Has registrado tu ${formData.tipoComida}.`,
                    icon: '🥗', 
                });

                // Disparamos la actualización de racha
                try {
                    await fetch('http://localhost:3000/api/rachas', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            habito: "nutricion", 
                            fechaActualizacion: new Date().toISOString()
                        })
                    });
                } catch(err) {
                    console.error('Error al actualizar racha de nutricion:', err);
                }
                
                // Limpiamos el texto para que pueda registrar otra cosa
                setFormData(prev => ({ ...prev, descripcionCorta: '' }));
                setTimeout(() => setIsSaved(false), 3000);
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
                
                {/* --- 1. BARRA DE BREADCRUMBS (Sin fondo blanco, limpia) --- */}
                <div className="w-full pt-2 pb-6 z-40 px-2 lg:px-4">
                    <Breadcrumbs />
                </div>

                {/* --- 2. CONTENIDO DEL REGISTRO DE NUTRICIÓN --- */}
                {/* Añadimos el scrollRef aquí */}
                <div ref={scrollRef} className="flex-1 w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="w-full max-w-4xl mx-auto space-y-6 lg:space-y-8 font-[Manrope] animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16 px-6 lg:px-8">
                        
                        {isLoading ? (
                            <>
                                <SkeletonPageHeader />
                                <SkeletonFormCard />
                            </>
                        ) : (
                        <>
                        {/* Header Dinámico */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-black text-dark-blue dark:text-pure-white tracking-tight transition-colors">Registro de Nutrición</h1>
                                <p className="text-dark-blue/60 dark:text-pure-white/60 font-medium mt-1 transition-colors">Registra tus comidas para que PrevIA analice tu dieta.</p>
                            </div>
                            {/* Card de cabecera con sombra y gradiente */}
                            <div className="bg-gradient-to-br from-dark-blue to-teal-dark dark:from-slate-700 dark:to-slate-600 p-4 rounded-3xl shadow-xl border border-teal-dark/20 dark:border-slate-500 text-pure-white flex items-center gap-4 group hover:scale-105 transition-all duration-300">
                                <div className="bg-pure-white/20 p-3 rounded-2xl">
                                    <Utensils className="w-6 h-6 text-pure-white" strokeWidth={2} />
                                </div>
                                <div className="pr-2">
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Registrando</div>
                                    <div className="text-xl font-black truncate max-w-[120px]">{formData.tipoComida}</div>
                                </div>
                            </div>
                        </div>

                        {/* Form Card (Con sombra fuerte para modo claro) */}
                        <div className="bg-pure-white dark:bg-slate-800 p-6 sm:p-10 rounded-3xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-700 relative overflow-hidden transition-colors">
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-60 h-60 bg-dark-blue/5 dark:bg-pure-white/5 rounded-full blur-3xl transition-colors"></div>

                            <form onSubmit={handleSave} className="relative z-10 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                    
                                    {/* Selector de Tipo de Comida (Izquierda) */}
                                    <div className="md:col-span-5 space-y-4">
                                        <h3 className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-widest border-l-4 border-teal-dark dark:border-light-teal pl-3 transition-colors">Tipo de Comida</h3>
                                        <div className="space-y-3 pt-2">
                                            {tiposComida.map((tipo) => {
                                                const IconComponent = tipo.icon;
                                                const isSelected = formData.tipoComida === tipo.label;
                                                return (
                                                    <button
                                                        key={tipo.label}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, tipoComida: tipo.label }))}
                                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                                                            isSelected 
                                                            ? 'bg-dark-blue border-dark-blue text-pure-white shadow-lg shadow-dark-blue/20 translate-x-2 dark:bg-teal-dark dark:border-teal-dark dark:shadow-teal-dark/20' 
                                                            : 'bg-slate-50 border-slate-100 text-dark-blue/50 hover:border-light-teal/50 hover:bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-pure-white/50 dark:hover:border-light-teal/50 dark:hover:bg-slate-800'
                                                        }`}
                                                    >
                                                        <IconComponent className={`w-5 h-5 ${isSelected ? 'text-pure-white' : 'text-dark-blue/40 dark:text-pure-white/40'}`} strokeWidth={2.5} />
                                                        <span className="font-bold text-sm tracking-tight">{tipo.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Descripción de la comida (Derecha) */}
                                    <div className="md:col-span-7 space-y-6">
                                        <h3 className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-widest border-l-4 border-teal-dark dark:border-light-teal pl-3 transition-colors">¿Qué comiste?</h3>
                                        
                                        <div className="space-y-2 pt-2">
                                            <label className="text-[10px] font-black text-dark-blue/40 dark:text-pure-white/60 uppercase tracking-widest ml-1 transition-colors">Descripción de los alimentos</label>
                                            <textarea
                                                name="descripcionCorta"
                                                required
                                                placeholder="Ej: 2 huevos revueltos con jamón, un pan integral y café sin azúcar..."
                                                value={formData.descripcionCorta}
                                                onChange={handleChange}
                                                rows={5}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 font-bold text-dark-blue dark:text-pure-white outline-none focus:border-teal-dark dark:focus:border-light-teal transition-all text-sm resize-none placeholder:text-dark-blue/20 dark:placeholder:text-pure-white/20"
                                            ></textarea>
                                        </div>

                                        <div className="flex items-center gap-2 text-dark-blue/40 dark:text-pure-white/50 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors">
                                            <Clock className="w-5 h-5 text-teal-dark dark:text-light-teal flex-shrink-0" strokeWidth={2.5} />
                                            <span className="text-xs font-bold leading-relaxed">
                                                PrevIA registrará automáticamente la hora actual (<span className="text-dark-blue dark:text-pure-white font-black">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>) de esta comida.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Section */}
                                <div className="pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors">
                                    <div className="flex items-center gap-4 text-dark-blue/40 dark:text-pure-white/40 hidden sm:flex transition-colors">
                                        <span className="text-xs font-bold italic">¡Registrar tus comidas mejora las recomendaciones de la IA!</span>
                                    </div>

                                    <div className="flex items-center justify-center sm:justify-end gap-4 w-full sm:w-auto">
                                        {isSaved && (
                                            <span className="text-teal-dark dark:text-light-teal font-black text-xs uppercase tracking-widest animate-in fade-in slide-in-from-right-4 hidden sm:block transition-colors">
                                                ¡Guardado!
                                            </span>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3
                                                ${isSubmitting 
                                                    ? 'bg-dark-blue/50 text-pure-white/80 cursor-not-allowed dark:bg-slate-700 dark:text-pure-white/50' 
                                                    : 'bg-dark-blue text-pure-white hover:bg-teal-dark shadow-xl hover:shadow-teal-dark/20 transform hover:-translate-y-1 active:scale-95 dark:bg-light-teal dark:text-dark-blue dark:hover:bg-teal-dark dark:hover:text-pure-white'
                                                }`}
                                        >
                                            <span>{isSubmitting ? 'Guardando...' : 'Guardar Comida'}</span>
                                            {!isSubmitting && <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Bottom Info Cards con Iconos Lucide */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
                            <div className="bg-gradient-to-br from-light-teal/20 to-teal-dark/5 dark:from-slate-800 dark:to-slate-800/50 p-6 rounded-3xl border border-light-teal/20 dark:border-slate-700 transition-colors shadow-sm">
                                <h4 className="font-black text-dark-blue dark:text-pure-white text-xs uppercase tracking-wider mb-2 flex items-center gap-2 transition-colors">
                                    <Apple className="w-4 h-4 text-teal-dark dark:text-light-teal" /> Tip Nutricional
                                </h4>
                                <p className="text-dark-blue/60 dark:text-pure-white/60 text-xs font-bold leading-relaxed transition-colors">
                                    Intenta que la mitad de tu plato sean vegetales. Esto ayuda a controlar las calorías sin pasar hambre.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-dark-blue/5 to-dark-blue/10 dark:from-slate-800 dark:to-slate-800/50 p-6 rounded-3xl border border-dark-blue/10 dark:border-slate-700 transition-colors shadow-sm">
                                <h4 className="font-black text-dark-blue dark:text-pure-white text-xs uppercase tracking-wider mb-2 flex items-center gap-2 transition-colors">
                                    <Utensils className="w-4 h-4 text-dark-blue/60 dark:text-pure-white/60" /> Balance
                                </h4>
                                <p className="text-dark-blue/60 dark:text-pure-white/60 text-xs font-bold leading-relaxed transition-colors">
                                    El equilibrio es clave. No te castigues por un gusto, simplemente retoma tu plan en la siguiente comida.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-teal-dark/10 to-light-teal/20 dark:from-slate-800 dark:to-slate-800/50 p-6 rounded-3xl border border-teal-dark/10 dark:border-slate-700 transition-colors shadow-sm">
                                <h4 className="font-black text-dark-blue dark:text-pure-white text-xs uppercase tracking-wider mb-2 flex items-center gap-2 transition-colors">
                                    <Coffee className="w-4 h-4 text-teal-dark dark:text-light-teal" /> Hidratación
                                </h4>
                                <p className="text-dark-blue/60 dark:text-pure-white/60 text-xs font-bold leading-relaxed transition-colors">
                                    Beber un vaso de agua antes de comer puede ayudarte a identificar mejor tus señales de saciedad.
                                </p>
                            </div>
                        </div>
                        </>)}
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
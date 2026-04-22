import React, { useState, useEffect } from 'react';
import logo from "../assets/PrevIa.png";
import { useToast } from '../context/ToastContext'; 

export default function AICoach() {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    
    const [reto, setReto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [mensajeBloqueo, setMensajeBloqueo] = useState(""); 
    const { toast } = useToast();

    useEffect(() => {
        // Animación de entrada inicial
        const timer = setTimeout(() => setIsVisible(true), 1500);

        const pedirRetoA_Gemini = async () => {
            const token = localStorage.getItem('tokenPrevia');
            if (!token) {
                setCargando(false);
                return;
            }

            const hoy = new Date().toLocaleDateString();
            const retoGuardado = localStorage.getItem('retoPrevia_Hoy');
            const fechaReto = localStorage.getItem('fechaRetoPrevia');
            const retoCompletado = localStorage.getItem('retoPrevia_Completado');

            // 1. SI YA COMPLETÓ EL RETO HOY, APAGAMOS EL COACH SILENCIOSAMENTE
            if (retoCompletado === hoy) {
                setIsClosed(true); 
                return;
            }

            // 2. SI YA TIENE UN RETO ASIGNADO HOY (pero no lo ha completado), USAMOS LA CACHÉ
            if (retoGuardado && fechaReto === hoy) {
                setReto(JSON.parse(retoGuardado));
                setCargando(false);
                return; 
            }

            // 3. SI NO HAY CACHÉ, ENTONCES SÍ LLAMAMOS AL BACKEND (Y A GEMINI)
            try {
                const respuesta = await fetch('http://localhost:3000/api/recomendaciones/generar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await respuesta.json();

                if (respuesta.ok && data.datos) {
                    setReto(data.datos);
                    // Guardamos en caché para no volver a preguntar hoy
                    localStorage.setItem('retoPrevia_Hoy', JSON.stringify(data.datos));
                    localStorage.setItem('fechaRetoPrevia', hoy);
                } else if (respuesta.status === 400 && data.registros_completos === false) {
                    setMensajeBloqueo(data.error);
                } else {
                    setMensajeBloqueo("No pude conectar con el servidor en este momento. Intenta más tarde.");
                }
            } catch (error) {
                console.error('Error de red al conectar con PrevIA:', error);
                setMensajeBloqueo("Revisa tu conexión a internet.");
            } finally {
                setCargando(false);
            }
        };

        pedirRetoA_Gemini();

        return () => clearTimeout(timer);
    }, []);

    // Cierra la tarjeta con una animación suave
    const cerrarCoach = () => {
        setIsVisible(false);
        setTimeout(() => setIsClosed(true), 700);
    };

    const marcarComoCompletado = async () => {
        if (!reto || !reto._id) return;

        const token = localStorage.getItem('tokenPrevia');
        
        try {
            const respuesta = await fetch(`http://localhost:3000/api/recomendaciones/${reto._id}/completar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (respuesta.ok) {
                toast.success('¡Reto completado! Excelente trabajo.', 'Medalla en camino');
                
                // Registramos que el usuario ya terminó por hoy
                const hoy = new Date().toLocaleDateString();
                localStorage.setItem('retoPrevia_Completado', hoy);
                
                cerrarCoach(); 
            } else {
                toast.error('Hubo un error al guardar tu progreso.');
            }
        } catch (error) {
            console.error('Error al completar reto:', error);
        }
    };

    // Si ya está cerrado o se completó el reto hoy, no renderizamos nada
    if (isClosed) return null;

    return (
        <div className={`fixed bottom-6 right-6 z-[100] w-[320px] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform 
            ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`}>

            <div className="relative group">
                {/* Glow effect cambia de color si está bloqueado */}
                <div className={`absolute -inset-1 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700 ${mensajeBloqueo ? 'bg-gradient-to-r from-red-400/20 to-orange-400/20' : 'bg-gradient-to-r from-teal-dark/20 to-dark-blue/20'}`}></div>

                <div className="relative bg-pure-white border border-light-teal/30 rounded-[1.8rem] p-5 shadow-2xl shadow-dark-blue/10 overflow-hidden">
                    
                    {/* Botón de cerrar (X) */}
                    <button
                        onClick={cerrarCoach}
                        className="absolute top-3 right-3 text-dark-blue/20 hover:text-dark-blue/60 transition-colors p-1 z-20 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <div className="flex gap-4 items-start relative z-10">
                        {/* Avatar */}
                        <div className="flex-shrink-0 relative">
                            <div className={`w-10 h-10 rounded-xl overflow-hidden shadow-md border border-light-teal/20 relative z-10 ${cargando ? 'animate-pulse' : ''}`}>
                                <img src={logo} alt="Coach PrevIA" className="w-full h-full object-cover" />
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-pure-white rounded-full z-20 ${cargando ? 'bg-yellow-400' : (mensajeBloqueo ? 'bg-orange-500' : 'bg-teal-dark')}`}></div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-dark-blue font-black text-xs tracking-tight">Coach PrevIA</span>
                                {!cargando && (
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${mensajeBloqueo ? 'text-orange-500/80' : 'text-teal-dark/60'}`}>
                                        • {mensajeBloqueo ? 'TAREA PENDIENTE' : (reto?.tipo_recomendacion || 'Reto Diario')}
                                    </span>
                                )}
                            </div>

                            {cargando ? (
                                <div className="space-y-2 mt-2 pr-2">
                                    <div className="h-3 bg-slate-100 rounded animate-pulse"></div>
                                    <div className="h-3 bg-slate-100 rounded animate-pulse w-4/5"></div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-dark-blue/80 text-[13px] font-bold leading-relaxed mb-3 pr-2">
                                        {mensajeBloqueo ? mensajeBloqueo : reto?.mensaje_texto}
                                    </p>

                                    <div className="flex gap-2">
                                        {/* Botón de Completar (Solo aparece si NO hay bloqueo) */}
                                        {!mensajeBloqueo && reto && (
                                            <button 
                                                onClick={marcarComoCompletado}
                                                className="bg-dark-blue text-pure-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-teal-dark transition-all active:scale-95 shadow-md"
                                            >
                                                ¡Hecho!
                                            </button>
                                        )}
                                        
                                        {/* Botón secundario */}
                                        <button 
                                            onClick={cerrarCoach} 
                                            className="text-dark-blue/40 px-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                                        >
                                            {mensajeBloqueo ? 'Entendido' : 'Omitir'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

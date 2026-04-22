import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layouts/sidebar';
import { MapPinOff, ArrowLeft, LayoutDashboard, Watch } from 'lucide-react';

export default function NotFound() {
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    // SOLUCIÓN AL SCROLL: Siempre inicia hasta arriba
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo(0, 0);
        }
    }, []);

    return (
        <Sidebar>
            {/* Contenedor Transparente y de alto completo (min-h-screen) */}
            <div ref={scrollRef} className="flex flex-col flex-1 w-full min-h-screen relative bg-transparent overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                
                {/* Contenido centrado dentro del contenedor transparente */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-8">
                    <div className="flex flex-col items-center text-center max-w-2xl w-full animate-in zoom-in duration-700">

                        {/* Número 404 Gigante y Estilizado */}
                        <div className="relative mb-8 select-none flex items-center justify-center">
                            <span className="text-[8rem] sm:text-[12rem] font-black leading-none text-dark-blue/5 dark:text-pure-white/5 absolute blur-sm">
                                404
                            </span>
                            <span className="relative text-[6rem] sm:text-[10rem] font-black leading-none bg-gradient-to-br from-dark-blue via-teal-dark to-light-teal bg-clip-text text-transparent drop-shadow-sm">
                                404
                            </span>
                        </div>

                        {/* Ícono de Perdido (Brinca) */}
                        <div className="bg-teal-dark/10 dark:bg-light-teal/10 p-5 rounded-full mb-8 animate-bounce text-teal-dark dark:text-light-teal shadow-lg shadow-teal-dark/10">
                            <MapPinOff className="w-12 h-12" strokeWidth={2.5} />
                        </div>

                        {/* Textos Principales */}
                        <h1 className="text-3xl sm:text-4xl font-black text-dark-blue dark:text-pure-white tracking-tight mb-4 transition-colors">
                            Página no encontrada
                        </h1>
                        
                        <p className="text-dark-blue/60 dark:text-pure-white/60 font-bold text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto transition-colors">
                            Parece que te has salido de la ruta. La página que buscas no existe o fue movida a otro lugar en PrevIA.
                        </p>

                        {/* REFERENCIA AL SMARTWATCH (Guiño amigable) */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left max-w-lg mx-auto mb-10 transition-colors">
                            <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-500">
                                <Watch className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
                            </div>
                            <p className="text-xs font-bold text-dark-blue/70 dark:text-pure-white/70 leading-relaxed transition-colors">
                                <span className="text-blue-500 dark:text-blue-400 font-black uppercase tracking-wider block mb-1">¿Buscabas tu Smartwatch?</span>
                                Si hiciste clic en conectar dispositivo, no te preocupes, esa función está en nuestro laboratorio y llegará en la próxima actualización.
                            </p>
                        </div>

                        {/* Botones de Acción */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center justify-center gap-3 bg-pure-white dark:bg-slate-800 text-dark-blue dark:text-pure-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-light-teal border-2 border-slate-100 dark:border-slate-700 transition-all active:scale-95 shadow-sm"
                            >
                                <ArrowLeft className="w-4 h-4" strokeWidth={3} />
                                Volver atrás
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center justify-center gap-3 bg-dark-blue text-pure-white dark:bg-light-teal dark:text-dark-blue px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-dark dark:hover:bg-pure-white shadow-xl shadow-dark-blue/20 dark:shadow-light-teal/20 hover:-translate-y-1 transition-all active:scale-95 border-2 border-transparent"
                            >
                                <LayoutDashboard className="w-4 h-4" strokeWidth={2.5} />
                                Ir al Panel
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
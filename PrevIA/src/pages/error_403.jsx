import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layouts/sidebar';
import { ShieldOff, ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function Error403() {
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
    }, []);

    return (
        <Sidebar>
            <div ref={scrollRef} className="flex flex-col flex-1 w-full min-h-screen relative bg-transparent overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-8">
                    <div className="flex flex-col items-center text-center max-w-2xl w-full animate-in zoom-in duration-700">

                        {/* Número gigante */}
                        <div className="relative mb-8 select-none flex items-center justify-center">
                            <span className="text-[8rem] sm:text-[12rem] font-black leading-none text-dark-blue/5 dark:text-pure-white/5 absolute blur-sm">
                                403
                            </span>
                            <span className="relative text-[6rem] sm:text-[10rem] font-black leading-none bg-gradient-to-br from-dark-blue via-teal-dark to-light-teal bg-clip-text text-transparent drop-shadow-sm">
                                403
                            </span>
                        </div>

                        {/* Ícono */}
                        <div className="bg-dark-blue/10 dark:bg-light-teal/10 p-5 rounded-full mb-8 animate-bounce text-dark-blue dark:text-light-teal shadow-lg shadow-dark-blue/10">
                            <ShieldOff className="w-12 h-12" strokeWidth={2.5} />
                        </div>

                        {/* Textos */}
                        <h1 className="text-3xl sm:text-4xl font-black text-dark-blue dark:text-pure-white tracking-tight mb-4 transition-colors">
                            Acceso denegado
                        </h1>
                        <p className="text-dark-blue/60 dark:text-pure-white/60 font-bold text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto transition-colors">
                            No tienes los permisos necesarios para ver esta página. Si crees que esto es un error, contacta con el administrador.
                        </p>

                        {/* Tarjeta informativa */}
                        <div className="bg-dark-blue/5 dark:bg-dark-blue/40 border border-dark-blue/15 dark:border-teal-dark/40 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left max-w-lg mx-auto mb-10 transition-colors">
                            <div className="bg-dark-blue/10 dark:bg-light-teal/10 p-3 rounded-2xl text-dark-blue dark:text-light-teal">
                                <ShieldOff className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
                            </div>
                            <p className="text-xs font-bold text-dark-blue/70 dark:text-pure-white/70 leading-relaxed transition-colors">
                                <span className="text-dark-blue dark:text-light-teal font-black uppercase tracking-wider block mb-1">Zona restringida</span>
                                Este contenido solo está disponible para usuarios con roles específicos. Tu nivel de acceso actual no incluye este módulo.
                            </p>
                        </div>

                        {/* Botones */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center justify-center gap-3 bg-pure-white dark:bg-dark-blue/40 text-dark-blue dark:text-pure-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-light-teal border-2 border-light-teal/30 dark:border-teal-dark/40 transition-all active:scale-95 shadow-sm"
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '../layouts/sidebar';
import Breadcrumbs from "../layouts/breadcrums"; 
import AICoach from '../components/AICoach';
import StatCard from '../components/ui/StatCard';
import ChartCard from '../components/ui/ChartCard';
import { SkeletonDashboard } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

// Iconos
import { Flame, Trophy, Award, Droplet, Activity, Moon, Utensils, ClipboardList, Dumbbell } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    
    // Estados del Perfil y Metas
    const [perfilUsuario, setPerfilUsuario] = useState(null);
    const [metas, setMetas] = useState(null); 
    const [rachaMax, setRachaMax] = useState(0); 
    const [medallas, setMedallas] = useState([]); 
    
    // Estado para controlar qué medallas están volteadas (Efecto Flip)
    const [flippedMedals, setFlippedMedals] = useState({});

    // Estados Dinámicos para Gráficas e Historial
    const [progresoHoy, setProgresoHoy] = useState({ agua: 0, sueno: 0, ejercicio: 0 });
    const [chartSueno, setChartSueno] = useState([]);
    const [chartActividad, setChartActividad] = useState([]);
    const [chartNutricion, setChartNutricion] = useState([]);
    const [historialReciente, setHistorialReciente] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("tokenPrevia");
        if (!token) {
            navigate("/login");
            return;
        }

        const cargarDatosDinamicos = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                };

                const [resPerfil, resMetas, resRachas, resMedallas, resSueno, resActividad, resAlimentacion, resBienestar] = await Promise.all([
                    fetch("http://localhost:3000/api/perfil", { method: "GET", headers }),
                    fetch("http://localhost:3000/api/perfil/metas", { method: "GET", headers }), 
                    fetch("http://localhost:3000/api/rachas", { method: "GET", headers }), 
                    fetch("http://localhost:3000/api/medallas", { method: "GET", headers }),
                    fetch("http://localhost:3000/api/sueno/historial", { method: "GET", headers }),
                    fetch("http://localhost:3000/api/actividad/historial", { method: "GET", headers }),
                    fetch("http://localhost:3000/api/alimentacion/historial", { method: "GET", headers }),
                    fetch("http://localhost:3000/api/bienestar/historial", { method: "GET", headers })
                ]);

                if (!resPerfil.ok) throw new Error("Token expirado");

                // 1. Cargar Perfil
                const dataPerfil = await resPerfil.json();
                setPerfilUsuario(dataPerfil);

                // 2. Cargar Metas
                if (resMetas.ok) {
                    const dataMetas = await resMetas.json();
                    setMetas(dataMetas);
                }

                // 3. Cargar Rachas y Medallas
                if (resRachas.ok) {
                    const dataRachas = await resRachas.json();
                    if (dataRachas?.length > 0) {
                        setRachaMax(Math.max(...dataRachas.map(r => r.dias_consecutivos)));
                    }
                }
                if (resMedallas.ok) setMedallas(await resMedallas.json());

                // 4. Procesar Datos de APIs para Gráficas
                const dataSueno = resSueno.ok ? await resSueno.json() : [];
                const dataActividad = resActividad.ok ? await resActividad.json() : [];
                const dataAlimentacion = resAlimentacion.ok ? await resAlimentacion.json() : [];
                const dataBienestar = resBienestar.ok ? await resBienestar.json() : [];

                const hoy = new Date().toISOString().split('T')[0];

                // --- PROGRESO DE HOY ---
                const registroAguaHoy = dataBienestar.find(b => b.fecha.startsWith(hoy));
                const registroSuenoHoy = dataSueno.find(s => s.fecha.startsWith(hoy));
                const registrosActividadHoy = dataActividad.filter(a => a.fecha.startsWith(hoy));
                
                const minEjercicioHoy = registrosActividadHoy.reduce((acc, act) => acc + act.duracion_minutos, 0);

                setProgresoHoy({
                    agua: registroAguaHoy?.vasos_agua_consumidos || 0,
                    sueno: registroSuenoHoy?.horas_dormidas || 0,
                    ejercicio: minEjercicioHoy
                });

                // --- GRÁFICA DE SUEÑO ---
                const diasSemana = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
                const suenoProcesado = dataSueno.slice(0, 7).reverse().map(s => ({
                    name: diasSemana[new Date(s.fecha).getUTCDay()],
                    horas: s.horas_dormidas
                }));
                setChartSueno(suenoProcesado);

                // --- GRÁFICA DE ACTIVIDAD ---
                const actividadProcesada = dataActividad.slice(0, 7).reverse().map(a => ({
                    name: diasSemana[new Date(a.fecha).getUTCDay()],
                    minutos: a.duracion_minutos
                }));
                setChartActividad(actividadProcesada);

                // --- GRÁFICA DE NUTRICIÓN ---
                const comidasHoy = dataAlimentacion.filter(a => a.fecha.startsWith(hoy));
                const conteoComidas = { 'Desayuno': 0, 'Comida': 0, 'Cena': 0, 'Snack': 0 };
                comidasHoy.forEach(c => {
                    if (c.tipo_comida.includes('Desayuno')) conteoComidas['Desayuno']++;
                    else if (c.tipo_comida.includes('Comida') || c.tipo_comida.includes('Almuerzo')) conteoComidas['Comida']++;
                    else if (c.tipo_comida.includes('Cena')) conteoComidas['Cena']++;
                    else conteoComidas['Snack']++;
                });

                const nutricionColores = [ '#4B8B8B', '#A1CBCB', '#cbd5e1'];
                const nutricionProcesada = Object.keys(conteoComidas)
                    .filter(k => conteoComidas[k] > 0)
                    .map((key, i) => ({
                        name: key,
                        value: conteoComidas[key],
                        color: nutricionColores[i]
                    }));
                
                setChartNutricion(nutricionProcesada.length > 0 ? nutricionProcesada : [{ name: 'Sin registros', value: 1, color: '#f1f5f9' }]);

                // --- HISTORIAL ---
                let historialMapeado = [];
                dataActividad.slice(0, 3).forEach(a => historialMapeado.push({
                    date: new Date(a.fecha).toLocaleDateString(),
                    activity: a.tipo_ejercicio,
                    value: a.duracion_minutos,
                    unit: 'min',
                    status: 'Completado',
                    icon: <Dumbbell className="w-5 h-5 text-teal-dark" />
                }));
                dataAlimentacion.slice(0, 3).forEach(a => historialMapeado.push({
                    date: new Date(a.fecha).toLocaleDateString(),
                    activity: a.tipo_comida,
                    value: 1,
                    unit: 'comida',
                    status: 'Registrado',
                    icon: <Utensils className="w-5 h-5 text-amber-600" />
                }));
                dataSueno.slice(0, 2).forEach(s => historialMapeado.push({
                    date: new Date(s.fecha).toLocaleDateString(),
                    activity: 'Sueño Analizado',
                    value: s.horas_dormidas,
                    unit: 'hrs',
                    status: `Calidad ${s.calidad}/5`,
                    icon: <Moon className="w-5 h-5 text-indigo-500" />
                }));

                historialMapeado.sort((a, b) => new Date(b.date) - new Date(a.date));
                setHistorialReciente(historialMapeado.slice(0, 5));

            } catch (error) {
                console.error("Error cargando el dashboard:", error);
                toast.error("Error al cargar tus datos en vivo.");
            } finally {
                setIsLoading(false);
            }
        };

        cargarDatosDinamicos();
    }, [navigate, toast]);

    const toggleFlipMedal = (id) => {
        setFlippedMedals(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <Sidebar>
            <div className="w-full rounded-3xl h-full flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                
                {/* --- BREADCRUMBS (Transparentes y sin caja como en Config) --- */}
                <div className="w-full pt-2 pb-6 z-40 px-2 lg:px-4">
                    <Breadcrumbs />
                </div>

                <div className="flex-1 w-full max-w-7xl mx-auto space-y-6 lg:space-y-8 font-[Manrope] p-6 lg:p-8 pb-12">
                    {isLoading ? (
                        <SkeletonDashboard />
                    ) : (
                    <>
                        {/* HEADER DINÁMICO */}
                        {/* Aumentadas las sombras (shadow-xl) y el borde para mayor contraste en modo claro */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-pure-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-700 transition-all">
                            <div>
                                <h1 className="text-3xl font-black text-dark-blue dark:text-pure-white">
                                    ¡Hola, {perfilUsuario?.nombre?.split(' ')[0] || 'Atleta'}! 
                                </h1>
                                <p className="text-dark-blue/60 dark:text-pure-white/60 font-medium mt-2 text-lg">
                                    Llevas <span className="font-bold text-teal-dark dark:text-light-teal">{progresoHoy.agua} de {metas?.meta_agua_vasos || 8} vasos</span> de agua hoy. ¡Sigue así!
                                </p>
                            </div>
                            <div className="md:w-1/3">
                                <AICoach /> 
                            </div>
                        </div>

                        {/* ACHIEVEMENTS Y RACHAS */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                            <div className="lg:col-span-1 bg-gradient-to-br from-dark-blue to-teal-dark p-8 rounded-3xl shadow-xl border border-teal-dark/20 flex flex-col items-center justify-center text-center text-pure-white relative overflow-hidden group hover:shadow-teal-dark/20 transition-all duration-300">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                    <Flame className="w-40 h-40" strokeWidth={1} />
                                </div>
                                <div className="relative z-10">
                                    <div className="bg-pure-white/10 backdrop-blur-sm p-4 rounded-full mb-6 inline-block border border-pure-white/20">
                                        <Flame className="w-10 h-10 text-orange-400 animate-pulse" fill="currentColor" />
                                    </div>
                                    <h3 className="text-lg font-bold text-pure-white/80 uppercase tracking-widest text-xs">Racha Activa</h3>
                                    <div className="text-7xl font-black my-2 drop-shadow-md">{rachaMax}</div>
                                    <p className="font-bold text-light-teal text-sm mt-2">
                                        {rachaMax === 0 ? "¡Registra un hábito hoy!" : "¡No rompas la cadena!"}
                                    </p>
                                </div>
                            </div>

                            <div className="lg:col-span-2 bg-pure-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-700 flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <span className="p-3 bg-light-teal/20 dark:bg-teal-dark/30 text-teal-dark dark:text-light-teal rounded-2xl">
                                            <Trophy className="w-6 h-6" strokeWidth={2.5} />
                                        </span>
                                        <h3 className="text-2xl font-bold text-dark-blue dark:text-pure-white">Tus Medallas</h3>
                                    </div>
                                    <span className="text-xs font-bold text-dark-blue/40 dark:text-pure-white/40 uppercase tracking-widest hidden sm:block">
                                        Doble clic para girar
                                    </span>
                                </div>
                                
                                {medallas.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center py-8">
                                        <Award className="w-20 h-20 text-slate-200 dark:text-slate-700 mb-4 stroke-[1.5]" />
                                        <p className="text-dark-blue/40 dark:text-pure-white/40 font-bold text-base">Aún no tienes medallas. ¡Cumple tus retos!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {medallas.map((badge) => (
                                            <div 
                                                key={badge.id_medalla} 
                                                className="relative w-full h-[140px] [perspective:1000px] cursor-pointer group"
                                                onDoubleClick={() => toggleFlipMedal(badge.id_medalla)}
                                            >
                                                <div className={`w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${flippedMedals[badge.id_medalla] ? '[transform:rotateY(180deg)]' : ''}`}>
                                                    
                                                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] flex flex-col items-center justify-center p-3 rounded-2xl bg-pure-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 group-hover:border-light-teal dark:group-hover:border-teal-dark transition-colors shadow-sm">
                                                        <span className="text-5xl mb-2 drop-shadow-sm">{badge.icono_url || '🏅'}</span>
                                                        <span className="text-xs font-black text-dark-blue dark:text-pure-white text-center leading-tight">{badge.nombre_medalla}</span>
                                                    </div>

                                                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-teal-dark to-dark-blue border-2 border-teal-dark shadow-lg">
                                                        <span className="text-[11px] font-bold text-pure-white text-center leading-snug">
                                                            {badge.descripcion_medalla}
                                                        </span>
                                                        <div className="mt-3 bg-pure-white/20 text-[9px] font-black text-pure-white px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-sm">
                                                            Completado
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* STATS ROW */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            <StatCard 
                                icon={<Droplet className="w-6 h-6 text-blue-500" fill="currentColor" />} 
                                label="Agua Hoy" 
                                value={`${progresoHoy.agua} / ${metas?.meta_agua_vasos || "8"}`} 
                                unit="vasos" 
                                trend={progresoHoy.agua >= (metas?.meta_agua_vasos || 8) ? "¡Meta cumplida!" : "Te falta poco"} 
                                trendUp={progresoHoy.agua >= (metas?.meta_agua_vasos || 8)} 
                                className="shadow-md border border-slate-200"
                            />
                            <StatCard 
                                icon={<Activity className="w-6 h-6 text-teal-dark dark:text-light-teal" strokeWidth={2.5} />} 
                                label="Ejercicio Hoy" 
                                value={`${progresoHoy.ejercicio} / ${metas?.meta_ejercicio_minutos || "30"}`} 
                                unit="min" 
                                trend={progresoHoy.ejercicio >= (metas?.meta_ejercicio_minutos || 30) ? "¡Meta cumplida!" : "Aún puedes lograrlo"} 
                                trendUp={progresoHoy.ejercicio >= (metas?.meta_ejercicio_minutos || 30)} 
                                className="shadow-md border border-slate-200"
                            />
                            <StatCard 
                                icon={<Moon className="w-6 h-6 text-indigo-500" fill="currentColor" />} 
                                label="Sueño Anoche" 
                                value={`${progresoHoy.sueno} / ${metas?.meta_sueno_horas || "8"}`} 
                                unit="hrs" 
                                trend={progresoHoy.sueno >= (metas?.meta_sueno_horas || 8) ? "¡Descanso ideal!" : "Intenta dormir más"} 
                                trendUp={progresoHoy.sueno >= (metas?.meta_sueno_horas || 8)} 
                                className="shadow-md border border-slate-200"
                            />
                        </div>

                        {/* CHARTS SECTION */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                            <ChartCard title="Actividad Física (Minutos)" className="shadow-xl border border-slate-200">
                                <ResponsiveContainer width="100%" height="100%">
                                    {chartActividad.length > 0 ? (
                                        <AreaChart data={chartActividad} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorPasos" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4B8B8B" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#4B8B8B" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} />
                                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#4B8B8B', fontWeight: '900', fontSize: '16px' }} />
                                            <Area type="monotone" dataKey="minutos" stroke="#4B8B8B" strokeWidth={4} fillOpacity={1} fill="url(#colorPasos)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4B8B8B' }} />
                                        </AreaChart>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-dark-blue/40 font-bold text-sm">Sin registros recientes</div>
                                    )}
                                </ResponsiveContainer>
                            </ChartCard>
                            
                            <ChartCard title="Horas de Sueño" className="shadow-xl border border-slate-200">
                                <ResponsiveContainer width="100%" height="100%">
                                    {chartSueno.length > 0 ? (
                                        <BarChart data={chartSueno} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={36}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} />
                                            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#4B8B8B', fontWeight: '900', fontSize: '16px' }} />
                                            <Bar dataKey="horas" fill="#4B8B8B" radius={[8, 8, 8, 8]} />
                                        </BarChart>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-dark-blue/40 font-bold text-sm">Sin registros recientes</div>
                                    )}
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>

                        {/* BOTTOM ROW */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            <div className="bg-pure-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-700 flex flex-col hover:shadow-2xl transition-all col-span-1 border-t-[6px] border-t-teal-dark">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <span className="p-3 bg-light-teal/20 dark:bg-teal-dark/30 text-teal-dark dark:text-light-teal rounded-2xl">
                                            <Utensils className="w-6 h-6" strokeWidth={2.5} />
                                        </span>
                                        <h3 className="text-xl font-bold text-dark-blue dark:text-pure-white">Comidas de Hoy</h3>
                                    </div>
                                </div>
                                <div className="h-[220px] w-full flex items-center justify-center relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={chartNutricion} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                                                {chartNutricion.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#4B8B8B', fontWeight: '900', fontSize: '15px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                {chartNutricion[0]?.name !== 'Sin registros' && (
                                    <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                        {chartNutricion.map((item) => (
                                            <div key={item.name} className="flex flex-col items-center">
                                                <span className="w-4 h-4 rounded-full mb-1.5" style={{ backgroundColor: item.color }}></span>
                                                <span className="text-xs font-bold text-dark-blue/60 dark:text-pure-white/60">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-2 bg-pure-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-700 flex flex-col hover:shadow-2xl transition-all">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <span className="p-3 bg-light-teal/20 dark:bg-teal-dark/30 text-teal-dark dark:text-light-teal rounded-2xl">
                                            <ClipboardList className="w-6 h-6" strokeWidth={2.5} />
                                        </span>
                                        <h3 className="text-2xl font-bold text-dark-blue dark:text-pure-white">Historial Reciente</h3>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                                                <th className="pb-4 font-black text-dark-blue/40 dark:text-pure-white/40 text-xs uppercase tracking-widest">Actividad</th>
                                                <th className="pb-4 font-black text-dark-blue/40 dark:text-pure-white/40 text-xs uppercase tracking-widest text-center">Valor</th>
                                                <th className="pb-4 font-black text-dark-blue/40 dark:text-pure-white/40 text-xs uppercase tracking-widest text-right">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                            {historialReciente.length > 0 ? historialReciente.map((item, index) => (
                                                <tr key={index} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                                    <td className="py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                                                                {item.icon}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-dark-blue dark:text-pure-white group-hover:text-teal-dark dark:group-hover:text-light-teal transition-colors text-base">{item.activity}</div>
                                                                <div className="text-xs font-bold text-dark-blue/40 dark:text-pure-white/40 mt-0.5">{item.date}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 text-center">
                                                        <span className="font-black text-lg text-dark-blue dark:text-pure-white">{item.value}</span>
                                                        <span className="text-xs font-bold text-dark-blue/40 dark:text-pure-white/40 ml-1.5">{item.unit}</span>
                                                    </td>
                                                    <td className="py-5 text-right">
                                                        <span className="inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-teal-dark/10 text-teal-dark dark:bg-light-teal/10 dark:text-light-teal border border-teal-dark/10">
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="3" className="py-10 text-center text-base font-bold text-dark-blue/40">No hay registros recientes.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                    )}
                </div>
            </div>
        </Sidebar>
    );
}
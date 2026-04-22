import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../layouts/sidebar';
import Breadcrumbs from "../layouts/breadcrums";
import { useToast } from '../context/ToastContext';
import { User, LogOut, AlertTriangle, ShieldCheck, Camera, Check } from 'lucide-react';

export default function Perfil() {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Referencia para arreglar el scroll "chiquito"
    const scrollRef = useRef(null);
    
    // Estados para modales
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); 
    
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [userData, setUserData] = useState({
        username: '',
        fullName: '',
        email: '',
        age: '',
        gender: 'Prefiero no decirlo',
        height: '',
        weight: '',
        bio: ''
    });

    // Asegurarnos de que inicie hasta arriba al cargar la pantalla
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo(0, 0);
        }
    }, []);

    useEffect(() => {
        const fetchPerfil = async () => {
            const token = localStorage.getItem('tokenPrevia');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/perfil', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    let edadCalculada = '';
                    if (data.fecha_nacimiento) {
                        const birthDate = new Date(data.fecha_nacimiento);
                        const today = new Date();
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const monthDiff = today.getMonth() - birthDate.getMonth();
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                        }
                        edadCalculada = age.toString();
                    }

                    setUserData({
                        username: data.email ? data.email.split('@')[0] : 'Usuario',
                        fullName: data.nombre || '',
                        email: data.email || '', 
                        age: edadCalculada,
                        gender: data.genero || 'Prefiero no decirlo',
                        height: data.altura ? (data.altura * 100).toString() : '',
                        weight: data.peso ? data.peso.toString() : '',
                        bio: data.biografia || 'Enfocado en mejorar mi salud día a día con tecnología.'
                    });

                    if (data.foto_url) setPreviewImage(data.foto_url);

                } else {
                    toast.error('No se pudo cargar tu perfil.');
                }
            } catch (error) {
                console.error('Error fetching perfil:', error);
                toast.error('Error de conexión.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPerfil();
    }, [toast]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('tokenPrevia');
        setIsEditing(false);
        
        try {
            const response = await fetch('http://localhost:3000/api/perfil', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: userData.fullName,
                    peso: parseFloat(userData.weight),
                    altura: parseFloat(userData.height) / 100, 
                    genero: userData.gender,
                    biografia: userData.bio
                })
            });

            if (response.ok) {
                toast.success('¡Perfil actualizado con éxito!');
                if (imageFile) {
                    toast.info('Imagen seleccionada. Configura Multer/Cloudinary en tu backend para guardarla.');
                }
            } else {
                toast.error('Error al guardar los cambios.');
            }
        } catch (error) {
            console.error('Error guardando perfil:', error);
            toast.error('Error de conexión.');
        }
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        localStorage.removeItem('tokenPrevia');
        window.location.href = '/login';
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(false);
        localStorage.removeItem('tokenPrevia');
        window.location.href = '/login';
    };

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
            {/* Contenedor principal: min-h-screen evita que se haga chiquita y bg-transparent quita el recuadro */}
            <div className="flex flex-col flex-1 w-full min-h-screen relative bg-transparent">
                
                {/* --- 1. BARRA DE BREADCRUMBS --- */}
                <div className="w-full pt-2 pb-6 z-40 px-2 lg:px-4">
                    <Breadcrumbs />
                </div>

                {/* --- 2. CONTENIDO DEL PERFIL --- */}
                <div ref={scrollRef} className="flex-1 w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="w-full max-w-5xl mx-auto space-y-8 font-[Manrope] animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16 px-6 lg:px-8">
                        
                        {/* Profile Header Card */}
                        <div className="bg-pure-white dark:bg-slate-800 rounded-3xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-700 overflow-hidden relative group transition-colors">
                            {/* --- DEGRADADO MEJORADO PARA MODO OSCURO --- */}
                            <div className="h-32 bg-gradient-to-r from-dark-blue to-teal-dark dark:from-slate-800 dark:via-teal-dark/40 dark:to-dark-blue opacity-90 transition-colors"></div>
                            
                            <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-12 relative z-10">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-3xl bg-pure-white dark:bg-slate-800 p-1.5 shadow-xl relative transition-colors">
                                        <label className={`cursor-pointer relative w-full h-full rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center border-2 border-slate-100 dark:border-slate-700 overflow-hidden group transition-colors ${!isEditing && 'pointer-events-none'}`}>
                                            {previewImage ? (
                                                <img src={previewImage} alt="Perfil" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-12 h-12 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
                                            )}
                                            
                                            {isEditing && (
                                                <div className="absolute inset-0 bg-dark-blue/70 dark:bg-slate-900/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                                                    <Camera className="w-6 h-6 text-pure-white mb-1" />
                                                    <span className="text-pure-white text-[10px] font-black uppercase tracking-widest text-center">Subir<br/>Foto</span>
                                                </div>
                                            )}
                                            <input 
                                                type="file" 
                                                accept="image/png, image/jpeg, image/jpg" 
                                                className="hidden" 
                                                disabled={!isEditing} 
                                                onChange={handleImageChange} 
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1 pb-2">
                                    <h1 className="text-3xl font-black text-dark-blue dark:text-pure-white tracking-tight transition-colors">{userData.fullName}</h1>
                                    <p className="text-dark-blue/50 dark:text-pure-white/50 font-bold transition-colors">@{userData.username}</p>
                                </div>
                                <div className="flex gap-3 pb-2">
                                    {isEditing ? (
                                        <button onClick={handleSave} className="flex items-center gap-2 bg-dark-blue text-pure-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-dark dark:bg-teal-dark dark:hover:bg-light-teal dark:hover:text-dark-blue transition-all shadow-lg active:scale-95">
                                            <Check className="w-4 h-4" strokeWidth={3} />
                                            Guardar Cambios
                                        </button>
                                    ) : (
                                        <button onClick={() => setIsEditing(true)} className="bg-light-teal text-teal-dark dark:bg-teal-dark/20 dark:text-light-teal px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-dark hover:text-pure-white dark:hover:bg-teal-dark dark:hover:text-pure-white transition-all shadow-sm">
                                            Editar Perfil
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Info Column */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-pure-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-700 space-y-8 transition-colors">
                                    <h2 className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-widest border-l-4 border-teal-dark dark:border-light-teal pl-3 transition-colors">Información Personal</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-dark-blue/40 dark:text-pure-white/40 uppercase tracking-widest ml-1 transition-colors">Nombre Completo</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                disabled={!isEditing}
                                                value={userData.fullName}
                                                onChange={handleInputChange}
                                                className={`w-full border-2 rounded-2xl px-5 py-3.5 font-bold outline-none transition-all ${isEditing ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 focus:border-teal-dark dark:focus:border-light-teal text-dark-blue dark:text-pure-white' : 'bg-transparent border-transparent text-dark-blue/70 dark:text-pure-white/70 cursor-not-allowed px-0'}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-dark-blue/40 dark:text-pure-white/40 uppercase tracking-widest ml-1 transition-colors">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                name="email"
                                                disabled={true} 
                                                value={userData.email}
                                                className="w-full border-2 rounded-2xl px-5 py-3.5 font-bold outline-none transition-all bg-transparent border-transparent text-dark-blue/50 dark:text-pure-white/50 cursor-not-allowed px-0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-dark-blue/40 dark:text-pure-white/40 uppercase tracking-widest ml-1 transition-colors">Edad (Aprox)</label>
                                            <input
                                                type="text"
                                                name="age"
                                                disabled={true} 
                                                value={userData.age || 'No especificada'}
                                                className="w-full border-2 rounded-2xl px-5 py-3.5 font-bold outline-none transition-all bg-transparent border-transparent text-dark-blue/70 dark:text-pure-white/70 cursor-not-allowed px-0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-dark-blue/40 dark:text-pure-white/40 uppercase tracking-widest ml-1 transition-colors">Género</label>
                                            <select
                                                name="gender"
                                                disabled={!isEditing}
                                                value={userData.gender}
                                                onChange={handleInputChange}
                                                className={`w-full border-2 rounded-2xl px-5 py-3.5 font-bold outline-none transition-all appearance-none ${isEditing ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 focus:border-teal-dark dark:focus:border-light-teal text-dark-blue dark:text-pure-white cursor-pointer' : 'bg-transparent border-transparent text-dark-blue/70 dark:text-pure-white/70 cursor-not-allowed px-0'}`}
                                            >
                                                <option value="Masculino">Masculino</option>
                                                <option value="Femenino">Femenino</option>
                                                <option value="Otro">Otro</option>
                                                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-4 space-y-2">
                                        <label className="text-[10px] font-black text-dark-blue/40 dark:text-pure-white/40 uppercase tracking-widest ml-1 transition-colors">Biografía</label>
                                        <textarea
                                            name="bio"
                                            rows="3"
                                            disabled={!isEditing}
                                            value={userData.bio}
                                            onChange={handleInputChange}
                                            className={`w-full border-2 rounded-2xl px-5 py-4 font-bold outline-none transition-all resize-none ${isEditing ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 focus:border-teal-dark dark:focus:border-light-teal text-dark-blue dark:text-pure-white' : 'bg-transparent border-transparent text-dark-blue/70 dark:text-pure-white/70 cursor-not-allowed px-0'}`}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="bg-pure-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-700 space-y-8 transition-colors">
                                    <h2 className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-widest border-l-4 border-teal-dark dark:border-light-teal pl-3 transition-colors">Métricas Físicas</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-dark-blue/40 dark:text-pure-white/40 uppercase tracking-widest ml-1 transition-colors">Altura (cm)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="height"
                                                    disabled={!isEditing}
                                                    value={userData.height}
                                                    onChange={handleInputChange}
                                                    className={`w-full border-2 rounded-2xl px-5 py-3.5 font-bold outline-none transition-all ${isEditing ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 focus:border-teal-dark dark:focus:border-light-teal text-dark-blue dark:text-pure-white' : 'bg-transparent border-transparent text-dark-blue/70 dark:text-pure-white/70 cursor-not-allowed px-0'}`}
                                                />
                                                <span className={`absolute top-1/2 -translate-y-1/2 font-black text-[10px] tracking-widest md:block hidden transition-colors ${isEditing ? 'right-5 text-dark-blue/20 dark:text-pure-white/20 underline decoration-teal-dark dark:decoration-light-teal' : 'right-0 text-dark-blue/70 dark:text-pure-white/70'}`}>CM</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-dark-blue/40 dark:text-pure-white/40 uppercase tracking-widest ml-1 transition-colors">Peso (kg)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="weight"
                                                    disabled={!isEditing}
                                                    value={userData.weight}
                                                    onChange={handleInputChange}
                                                    className={`w-full border-2 rounded-2xl px-5 py-3.5 font-bold outline-none transition-all ${isEditing ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 focus:border-teal-dark dark:focus:border-light-teal text-dark-blue dark:text-pure-white' : 'bg-transparent border-transparent text-dark-blue/70 dark:text-pure-white/70 cursor-not-allowed px-0'}`}
                                                />
                                                <span className={`absolute top-1/2 -translate-y-1/2 font-black text-[10px] tracking-widest md:block hidden transition-colors ${isEditing ? 'right-5 text-dark-blue/20 dark:text-pure-white/20 underline decoration-teal-dark dark:decoration-light-teal' : 'right-0 text-dark-blue/70 dark:text-pure-white/70'}`}>KG</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Account Management Column */}
                            <div className="space-y-8">
                                <div className="bg-pure-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-700 space-y-8 transition-colors">
                                    <h2 className="text-sm font-black text-dark-blue dark:text-pure-white uppercase tracking-widest border-l-4 border-teal-dark dark:border-light-teal pl-3 transition-colors">Seguridad y Cuenta</h2>

                                    <div className="space-y-4">
                                        <button
                                            onClick={handleLogoutClick}
                                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 hover:border-light-teal dark:hover:border-slate-600 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 flex items-center justify-center transition-colors">
                                                    <LogOut className="w-5 h-5 ml-1" strokeWidth={2.5} />
                                                </div>
                                                <span className="font-black text-dark-blue dark:text-pure-white text-xs uppercase tracking-wider transition-colors">Cerrar Sesión</span>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-50/30 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/20 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors">
                                                    <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />
                                                </div>
                                                <span className="font-black text-red-500 text-xs uppercase tracking-wider">Eliminar Cuenta</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Premium Tip */}
                                <div className="bg-gradient-to-br from-dark-blue to-teal-dark dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 p-8 rounded-3xl shadow-xl text-pure-white relative overflow-hidden transition-colors border border-transparent dark:border-slate-700">
                                    <ShieldCheck className="w-32 h-32 absolute -top-6 -right-6 opacity-10" strokeWidth={1} />
                                    <h4 className="font-black text-xs uppercase tracking-widest mb-3 opacity-80 relative z-10">Tip de Seguridad</h4>
                                    <p className="text-xs font-bold leading-relaxed relative z-10">
                                        Recuerda nunca compartir tus credenciales de acceso. En PrevIA nos tomamos en serio tu privacidad.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MODAL CERRAR SESIÓN --- */}
                {showLogoutModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-dark-blue/40 dark:bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-pure-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-blue-100 dark:border-slate-700 animate-in zoom-in duration-300 transition-colors">
                            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-colors">
                                <LogOut className="w-10 h-10 ml-1" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-black text-dark-blue dark:text-pure-white text-center tracking-tight transition-colors">¿Cerrar sesión?</h3>
                            <p className="text-dark-blue/60 dark:text-pure-white/60 font-bold text-center mt-3 leading-relaxed transition-colors">
                                Tendrás que volver a ingresar tus credenciales la próxima vez que quieras acceder a PrevIA.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="bg-slate-100 dark:bg-slate-700 text-dark-blue dark:text-pure-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="bg-dark-blue text-pure-white dark:bg-light-teal dark:text-dark-blue px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-dark dark:hover:bg-pure-white transition-all shadow-lg shadow-dark-blue/20 dark:shadow-light-teal/20"
                                >
                                    Sí, salir
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- MODAL ELIMINAR CUENTA --- */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-dark-blue/40 dark:bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-pure-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-red-100 dark:border-red-900 animate-in zoom-in duration-300 transition-colors">
                            <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-colors">
                                <AlertTriangle className="w-10 h-10" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-black text-dark-blue dark:text-pure-white text-center tracking-tight transition-colors">¿Eliminar esta cuenta?</h3>
                            <p className="text-dark-blue/60 dark:text-pure-white/60 font-bold text-center mt-3 leading-relaxed transition-colors">
                                Esta acción es irreversible. Perderás todo tu historial de salud, rachas y logros conseguidos hasta hoy.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="bg-slate-100 dark:bg-slate-700 text-dark-blue dark:text-pure-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                >
                                    No, mantener
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="bg-red-500 text-pure-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                >
                                    Sí, eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Sidebar>
    );
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../layouts/navbar';
import logo from "../assets/PrevIa.png";
import { useToast } from '../context/ToastContext';

export default function FormularioPersonal() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false); // Para el botón de carga
    
    // Rescatamos el nombre si viene del registro
    const nombreGuardado = localStorage.getItem("nombrePrevia") || "";

    const [formData, setFormData] = useState({
        nombre: nombreGuardado,
        fecha_nacimiento: '',
        peso: '',
        altura: '',
        genero: 'Prefiero no decirlo'
    });
    const [errors, setErrors] = useState({});

    // Protegemos la ruta
    useEffect(() => {
        const token = localStorage.getItem("tokenPrevia");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) {
            newErrors.nombre = "El nombre es obligatorio.";
        }

        if (!formData.fecha_nacimiento) {
            newErrors.fecha_nacimiento = "La fecha de nacimiento es obligatoria.";
        } else {
            const birthDate = new Date(formData.fecha_nacimiento);
            const today = new Date();
            if (birthDate > today) {
                newErrors.fecha_nacimiento = "La fecha no puede ser futura.";
            }
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 18) {
                newErrors.fecha_nacimiento = "Debes ser mayor de 18 años.";
            }
        }
        return newErrors;
    };

    const validateStep2 = () => {
        const newErrors = {};
        const peso = parseFloat(formData.peso);
        const altura = parseFloat(formData.altura);

        if (!formData.peso) {
            newErrors.peso = "El peso es obligatorio.";
        } else if (peso < 20 || peso > 300) {
            newErrors.peso = "Ingresa un peso válido (20-300kg).";
        }

        if (!formData.altura) {
            newErrors.altura = "La altura es obligatoria.";
        } else if (altura < 50 || altura > 250) {
            newErrors.altura = "Ingresa una altura válida (50-250cm).";
        }

        return newErrors;
    };

    // AQUÍ ESTÁ LA MAGIA DE LA CONEXIÓN
    const handleSubmit = async (e) => {
        e.preventDefault();
        const step2Errors = validateStep2();
        if (Object.keys(step2Errors).length > 0) {
            setErrors(step2Errors);
            toast.error('Revisa los campos marcados en rojo.', 'Datos inválidos');
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem("tokenPrevia");

        try {
            const respuesta = await fetch("http://localhost:3000/api/perfil", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    fechaNacimiento: formData.fecha_nacimiento, // Ajustado al formato del backend
                    peso: parseFloat(formData.peso),
                    altura: parseFloat(formData.altura) / 100, // Convertimos de CM a Metros
                    genero: formData.genero
                    // Las metas se llenarán solas con 8 vasos, 8 horas y 30 mins
                }),
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                toast.success('¡Perfil configurado correctamente!', 'Bienvenido');
                localStorage.removeItem("nombrePrevia"); // Limpiamos la memoria
                setTimeout(() => navigate('/dashboard'), 1500);
            } else {
                toast.error(data.error || 'Error al guardar el perfil', 'Ups');
            }
        } catch (error) {
            console.error("Error de red:", error);
            toast.error('Error de conexión con el servidor', 'Revisa tu internet');
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        const step1Errors = validateStep1();
        if (Object.keys(step1Errors).length > 0) {
            setErrors(step1Errors);
            toast.error('Completa todos los campos requeridos.', 'Campos incompletos');
            return;
        }
        toast.info('Un paso más y listo.', 'Paso 2 de 2');
        setStep(prev => prev + 1);
    };
    
    const prevStep = () => {
        setErrors({});
        setStep(prev => prev - 1);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-[Manrope] selection:bg-light-teal selection:text-dark-blue">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
                <div className="bg-pure-white rounded-[2.5rem] shadow-2xl shadow-dark-blue/5 border border-light-teal/20 overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-in fade-in zoom-in duration-700">

                    {/* Lateral Informativo */}
                    <div className="w-full md:w-1/3 bg-dark-blue p-10 text-pure-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-7xl opacity-10">🌿</div>
                        <div className="relative z-10">
                            <img src={logo} alt="PrevIa Logo" className="w-16 h-16 rounded-2xl shadow-lg mb-8" />
                            <h2 className="text-3xl font-black leading-tight tracking-tighter mb-4">Configura tu perfil</h2>
                            <p className="text-light-teal/70 text-sm font-medium leading-relaxed">
                                Necesitamos conocerte un poco mejor para personalizar tus metas y recomendaciones de salud.
                            </p>
                        </div>

                        <div className="mt-12 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-light-teal text-dark-blue' : 'bg-pure-white/10 text-pure-white/40'}`}>1</div>
                                <span className={`text-xs font-bold uppercase tracking-widest ${step >= 1 ? 'text-pure-white' : 'text-pure-white/40'}`}>Información Básica</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-light-teal text-dark-blue' : 'bg-pure-white/10 text-pure-white/40'}`}>2</div>
                                <span className={`text-xs font-bold uppercase tracking-widest ${step >= 2 ? 'text-pure-white' : 'text-pure-white/40'}`}>Métricas Físicas</span>
                            </div>
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {step === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-dark-blue tracking-tight">Bienvenido a PrevIA</h3>
                                        <p className="text-dark-blue/50 text-sm font-bold">Cuéntanos cómo te llamas y cuándo naciste.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-dark-blue/40 uppercase tracking-widest ml-1">Nombre Completo</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleInputChange}
                                                placeholder="Ej. Adrian Guzmán"
                                                className={`w-full bg-slate-50 border-2 ${errors.nombre ? 'border-red-400' : 'border-slate-100'} rounded-2xl px-5 py-4 font-bold text-dark-blue outline-none focus:border-teal-dark transition-all`}
                                            />
                                            {errors.nombre && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase">{errors.nombre}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-dark-blue/40 uppercase tracking-widest ml-1">Fecha de Nacimiento</label>
                                            <input
                                                type="date"
                                                name="fecha_nacimiento"
                                                value={formData.fecha_nacimiento}
                                                onChange={handleInputChange}
                                                className={`w-full bg-slate-50 border-2 ${errors.fecha_nacimiento ? 'border-red-400' : 'border-slate-100'} rounded-2xl px-5 py-4 font-bold text-dark-blue outline-none focus:border-teal-dark transition-all appearance-none`}
                                            />
                                            {errors.fecha_nacimiento && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase">{errors.fecha_nacimiento}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-dark-blue/40 uppercase tracking-widest ml-1">Género</label>
                                            <select
                                                name="genero"
                                                value={formData.genero}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-dark-blue outline-none focus:border-teal-dark transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="Masculino">Masculino</option>
                                                <option value="Femenino">Femenino</option>
                                                <option value="Otro">Otro</option>
                                                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="w-full bg-dark-blue text-pure-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-dark shadow-xl shadow-dark-blue/20 transition-all active:scale-95"
                                    >
                                        Siguiente Paso
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-dark-blue tracking-tight">Casi terminamos</h3>
                                        <p className="text-dark-blue/50 text-sm font-bold">Estos datos son clave para calcular tus calorías base.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-dark-blue/40 uppercase tracking-widest ml-1">Peso (kg)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="peso"
                                                    step="0.1"
                                                    value={formData.peso}
                                                    onChange={handleInputChange}
                                                    placeholder="70.5"
                                                    className={`w-full bg-slate-50 border-2 ${errors.peso ? 'border-red-400' : 'border-slate-100'} rounded-2xl px-5 py-4 font-bold text-dark-blue outline-none focus:border-teal-dark transition-all`}
                                                />
                                                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-[10px] text-dark-blue/20">KG</span>
                                            </div>
                                            {errors.peso && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase">{errors.peso}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-dark-blue/40 uppercase tracking-widest ml-1">Altura (cm)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="altura"
                                                    step="0.1"
                                                    value={formData.altura}
                                                    onChange={handleInputChange}
                                                    placeholder="175"
                                                    className={`w-full bg-slate-50 border-2 ${errors.altura ? 'border-red-400' : 'border-slate-100'} rounded-2xl px-5 py-4 font-bold text-dark-blue outline-none focus:border-teal-dark transition-all`}
                                                />
                                                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-[10px] text-dark-blue/20">CM</span>
                                            </div>
                                            {errors.altura && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase">{errors.altura}</p>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            disabled={isSubmitting}
                                            className="flex-1 bg-slate-100 text-dark-blue py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            Atrás
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-[2] bg-teal-dark text-pure-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-dark-blue shadow-xl shadow-teal-dark/20 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Guardando...' : 'Completar Registro'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Mensaje de privacidad */}
                <p className="text-center mt-12 text-dark-blue/30 text-xs font-bold leading-relaxed max-w-lg mx-auto">
                    Tus datos físicos se utilizan exclusivamente para propósitos de salud y nunca se comparten sin tu consentimiento.
                </p>
            </main>
        </div>
    );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../layouts/footer";
import Navbar from "../layouts/navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import { CheckCircle2, XCircle, ShieldAlert } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showStep, setShowStep] = useState(false);

  // Captcha matemático simple
  const [captchaMath, setCaptchaMath] = useState({ num1: 0, num2: 0 });

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    captchaAnswer: "",
    aceptaTerminos: false
  });
  const [errors, setErrors] = useState({});

  // 1. SCROLL HACIA ARRIBA Y GENERAR CAPTCHA AL ENTRAR
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    generarCaptcha();
  }, []);

  // Detectar scroll para mostrar el paso
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowStep(true);
      } else {
        setShowStep(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const generarCaptcha = () => {
    setCaptchaMath({
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1
    });
    setFormData(prev => ({ ...prev, captchaAnswer: "" }));
  };

  // Evaluador de Fuerza de Contraseña
  const getPasswordStrength = (pass) => {
    let score = 0;
    let missing = [];

    if (!pass) return { score: 0, color: 'bg-slate-200', text: '', missing: [] };

    if (pass.length >= 8) score++; else missing.push("8 caracteres");
    if (/[A-Z]/.test(pass)) score++; else missing.push("1 mayúscula");
    if (/[0-9]/.test(pass)) score++; else missing.push("1 número");
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++; else missing.push("1 símbolo especial");

    let color = 'bg-red-400';
    let text = 'Débil';
    if (score === 2) { color = 'bg-yellow-400'; text = 'Media'; }
    if (score === 3) { color = 'bg-light-teal'; text = 'Buena'; }
    if (score === 4) { color = 'bg-green-500'; text = 'Fuerte'; }

    return { score, color, text, missing };
  };

  const passStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const confirmHasText = formData.confirmPassword.length > 0;

  const validateRegister = (data) => {
    const newErrors = {};
    if (!data.userName.trim()) newErrors.userName = "El nombre completo es obligatorio.";

    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email) newErrors.email = "El correo es obligatorio.";
    else if (!re.test(data.email)) newErrors.email = "Formato inválido.";

    if (passStrength.score < 4) newErrors.password = "La contraseña debe cumplir todos los requisitos.";

    if (data.password !== data.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden.";

    if (parseInt(data.captchaAnswer) !== (captchaMath.num1 + captchaMath.num2)) {
      newErrors.captchaAnswer = "Respuesta incorrecta. Intenta de nuevo.";
      generarCaptcha();
    }

    if (!data.aceptaTerminos) newErrors.aceptaTerminos = "Debes aceptar los términos y condiciones.";

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id || e.target.name]: type === "checkbox" ? checked : value
    }));

    if (errors[id || e.target.name]) {
      setErrors(prev => ({ ...prev, [id || e.target.name]: null }));
    }
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const validationErrors = validateRegister(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const respuestaRegistro = await fetch("http://localhost:3000/api/usuarios/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          aceptaIA: true
        }),
      });

      const dataRegistro = await respuestaRegistro.json();

      if (respuestaRegistro.ok) {
        const respuestaLogin = await fetch("http://localhost:3000/api/usuarios/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });

        const dataLogin = await respuestaLogin.json();

        if (respuestaLogin.ok) {
          localStorage.setItem("tokenPrevia", dataLogin.token);
          localStorage.setItem("nombrePrevia", formData.userName);
          navigate("/formulario_personal");
        } else {
          setServerError("Usuario creado, pero hubo un error al iniciar sesión.");
        }
      } else {
        setServerError(dataRegistro.error || "Error al crear la cuenta");
      }
    } catch (error) {
      console.error("Error de red:", error);
      setServerError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-pure-white text-dark-blue font-[Manrope] selection:bg-light-teal selection:text-dark-blue overflow-x-hidden relative">
      <AnimatedBackground />
      <Navbar />

      {/* 2. ALINEACIÓN MEJORADA: items-stretch para que form y diseño midan lo mismo, gap-8 para juntarlos */}
      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto items-stretch justify-center p-6 lg:p-10 gap-8 my-4 lg:my-8">

        {/* CARD DEL FORMULARIO - Letra más grande y espaciado mejorado */}
        <div className="w-full lg:w-[500px] flex-shrink-0 bg-pure-white z-10 p-8 sm:p-10 order-2 lg:order-1 rounded-[2rem] shadow-[0_10px_40px_rgba(187,230,228,0.4)] border border-light-teal/50 flex flex-col justify-center">

          <div className="mb-8 text-center sm:text-left">
            <h3 className="text-4xl font-black text-dark-blue mb-3">Comienza ahora</h3>
            <p className="text-dark-blue/70 font-medium text-base">Crea tu cuenta gratuita y toma el control.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Input Nombre */}
            <div className="space-y-2">
              <label htmlFor="userName" className="block text-sm font-black uppercase tracking-widest text-dark-blue/70 ml-1">
                Nombre completo
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="userName"
                  placeholder="Ej. María García"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 border-2 ${errors.userName ? 'border-red-400' : 'border-slate-100'} focus:border-light-teal focus:bg-pure-white text-dark-blue px-4 py-4 rounded-2xl text-base font-bold outline-none transition-all placeholder:text-dark-blue/30`}
                />
                {errors.userName && <p className="text-xs text-red-500 font-bold mt-1.5 ml-1 uppercase">{errors.userName}</p>}
              </div>
            </div>

            {/* Input Correo */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-black uppercase tracking-widest text-dark-blue/70 ml-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="tu@correo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 border-2 ${errors.email ? 'border-red-400' : 'border-slate-100'} focus:border-light-teal focus:bg-pure-white text-dark-blue px-4 py-4 rounded-2xl text-base font-bold outline-none transition-all placeholder:text-dark-blue/30`}
                />
                {errors.email && <p className="text-xs text-red-500 font-bold mt-1.5 ml-1 uppercase">{errors.email}</p>}
              </div>
            </div>

            {/* Input Contraseña Interactivo */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-black uppercase tracking-widest text-dark-blue/70 ml-1">
                Contraseña
              </label>
              <div className={`relative flex items-center bg-slate-50 border-2 ${errors.password ? 'border-red-400' : 'border-slate-100'} focus-within:border-light-teal focus-within:bg-pure-white rounded-2xl transition-all pr-3`}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Crea una contraseña segura"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-transparent text-base font-bold text-dark-blue px-4 py-4 outline-none placeholder:text-dark-blue/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-dark-blue/40 hover:text-teal-dark p-2 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>

              {/* Medidor de Fuerza */}
              {formData.password.length > 0 && (
                <div className="pt-2 px-1 transition-all">
                  <div className="flex gap-1.5 h-2 mb-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`flex-1 rounded-full ${i < passStrength.score ? passStrength.color : 'bg-slate-200'} transition-colors duration-300`}></div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1">
                    {passStrength.missing.length === 0 ? (
                      <span className="text-xs font-black text-green-500 uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> ¡Contraseña segura!</span>
                    ) : (
                      <span className="text-xs font-bold text-dark-blue/50 flex flex-wrap gap-1 leading-snug">
                        Falta: <span className="text-red-500 font-black">{passStrength.missing.join(", ")}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Input Confirmar Contraseña */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-black uppercase tracking-widest text-dark-blue/70 ml-1">
                Confirmar Contraseña
              </label>
              <div className={`relative flex items-center bg-slate-50 border-2 transition-all pr-3 rounded-2xl
                ${!confirmHasText ? 'border-slate-100 focus-within:border-light-teal' : passwordsMatch ? 'border-green-500 bg-green-50/30' : 'border-red-400 bg-red-50/30'}
              `}>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-transparent text-base font-bold text-dark-blue px-4 py-4 outline-none placeholder:text-dark-blue/30"
                />
                {confirmHasText && (
                  passwordsMatch ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500 mr-2" strokeWidth={2.5} />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 mr-2" strokeWidth={2.5} />
                  )
                )}
              </div>
              {confirmHasText && !passwordsMatch && <p className="text-xs text-red-500 font-bold mt-1.5 ml-1 uppercase">Las contraseñas no coinciden</p>}
            </div>

            {/* CAPTCHA ANTI-SPAM */}
            <div className="space-y-2 pt-2">
              <label htmlFor="captchaAnswer" className="block text-sm font-black uppercase tracking-widest text-dark-blue/70 ml-1 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-teal-dark" /> Verificación humana
              </label>
              <div className="flex gap-4">
                <div className="flex-1 bg-light-teal/20 border border-light-teal/50 rounded-2xl flex items-center justify-center font-black text-teal-dark text-xl select-none tracking-widest">
                  {captchaMath.num1} + {captchaMath.num2} = ?
                </div>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    id="captchaAnswer"
                    placeholder="Respuesta"
                    value={formData.captchaAnswer}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-50 border-2 ${errors.captchaAnswer ? 'border-red-400' : 'border-slate-100'} focus:border-light-teal focus:bg-pure-white text-dark-blue px-4 py-4 rounded-2xl text-base font-bold outline-none transition-all text-center`}
                  />
                </div>
              </div>
              {errors.captchaAnswer && <p className="text-xs text-red-500 font-bold mt-1.5 ml-1 uppercase">{errors.captchaAnswer}</p>}
            </div>

            {/* Opciones */}
            <div className="flex flex-col pt-3">
              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  id="aceptaTerminos"
                  name="aceptaTerminos"
                  checked={formData.aceptaTerminos}
                  onChange={handleInputChange}
                  className="w-5 h-5 mt-0.5 rounded border-light-teal/40 text-teal-dark focus:ring-teal-dark accent-teal-dark cursor-pointer transition-all"
                />
                <span className="text-sm font-medium text-dark-blue/80 group-hover:text-dark-blue transition-colors leading-relaxed">
                  Al registrarte, aceptas nuestros <a href="#" className="text-teal-dark font-bold hover:underline">Términos de Servicio</a> y la <a href="#" className="text-teal-dark font-bold hover:underline">Política de Privacidad</a>.
                </span>
              </label>
              {errors.aceptaTerminos && <p className="text-xs text-red-500 font-bold mt-1.5 ml-9 uppercase">{errors.aceptaTerminos}</p>}
            </div>

            {/* Alerta de Error del Servidor */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-base text-red-700 font-bold">{serverError}</p>
              </div>
            )}

            {/* Botón Registrarse */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 mt-6 rounded-2xl font-black uppercase tracking-widest text-base transition-all duration-300 flex items-center justify-center gap-2 ${loading
                  ? 'bg-teal-dark/50 text-pure-white/80 cursor-not-allowed'
                  : 'bg-teal-dark text-pure-white hover:bg-dark-blue shadow-lg shadow-teal-dark/30 hover:shadow-dark-blue/30 hover:-translate-y-1'
                }`}
            >
              {loading ? 'Creando cuenta...' : 'Crear una cuenta'}
            </button>
          </form>

          {/* Separador */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-black text-dark-blue/40 uppercase tracking-widest">O regístrate con</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <button className="flex w-full items-center justify-center gap-3 border-2 border-slate-100 bg-slate-50 py-4 rounded-2xl hover:bg-light-teal/10 hover:border-light-teal transition-all text-dark-blue font-bold text-base">
            <img src="https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/brand-logo/google-icon.png" alt="Google" className="w-6 h-6" />
            Continuar con Google
          </button>

          <p className="text-center mt-8 text-dark-blue/70 font-medium text-base">
            ¿Ya eres miembro?{" "}
            <Link to="/login" className="text-teal-dark font-black hover:text-dark-blue transition-colors hover:underline underline-offset-4 decoration-2">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* ILUSTRACIÓN / DECORACIÓN - Altura dinámica adaptada con flex-1 */}
        <div className="hidden lg:flex flex-1 relative w-full rounded-[2rem] bg-gradient-to-tr from-light-teal via-teal-dark to-dark-blue p-12 overflow-hidden items-end justify-start shadow-2xl order-1 lg:order-2">
          <div className="absolute inset-0 bg-dark-blue/10 backdrop-blur-[2px]"></div>
          <div className="absolute top-10 right-10 w-40 h-40 bg-pure-white rounded-full mix-blend-overlay filter blur-[50px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-60 h-60 bg-light-teal rounded-full mix-blend-overlay filter blur-[60px] opacity-60"></div>
          <div className="relative z-10 text-pure-white w-full pr-10">
            <span className="inline-block px-4 py-1.5 bg-pure-white/20 backdrop-blur-md border border-pure-white/30 rounded-full text-xs font-black text-pure-white mb-6 tracking-widest uppercase shadow-sm">
              Únete a la revolución médica
            </span>
            <h2 className="text-5xl font-black leading-tight drop-shadow-md">
              El primer paso <br /> hacia tu nueva versión.
            </h2>
            <div className={`mt-6 transition-all duration-500 ${showStep ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="inline-block px-4 py-2 bg-pure-white/10 backdrop-blur-md border border-pure-white/20 rounded-full text-sm font-bold text-pure-white tracking-wide shadow-sm">
                Paso 1 casi completado
              </span>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
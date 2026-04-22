import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../layouts/footer";
import Navbar from "../layouts/navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import { XCircle } from "lucide-react";


export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const validateLogin = (data) => {
    const newErrors = {};
    if (!data.email) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Formato de correo inválido.";
    }

    if (!data.password) {
      newErrors.password = "La contraseña es obligatoria.";
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: null }));
    }
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const validationErrors = validateLogin(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const respuesta = await fetch("http://localhost:3000/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        localStorage.setItem("tokenPrevia", data.token);
        console.log("Login exitoso en la BD");
        navigate("/dashboard");
      } else {
        const errorMsg = data.error || "Error al iniciar sesión";
        const msgLower = errorMsg.toLowerCase();
        
        if (msgLower.includes("contraseña") || msgLower.includes("password") || msgLower.includes("credenciales")) {
          setErrors({ password: errorMsg });
        } else if (msgLower.includes("correo") || msgLower.includes("usuario") || msgLower.includes("email")) {
          setErrors({ email: errorMsg });
        } else {
          setServerError(errorMsg);
        }
      }
    } catch (error) {
      console.error("Error de red:", error);
      setServerError("Error de conexión con el servidor. Verifica que tu backend esté encendido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-pure-white text-dark-blue font-[Manrope] selection:bg-light-teal selection:text-dark-blue overflow-x-hidden relative">
      <AnimatedBackground />
      <Navbar />

      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto items-stretch justify-center p-6 lg:p-10 gap-8 my-4 lg:my-8">
        
        {/* ILUSTRACIÓN / DECORACIÓN - Ahora está en orden 1 en Desktop (Izquierda) */}
        <div className="hidden lg:flex flex-1 relative w-full rounded-[2rem] bg-gradient-to-br from-dark-blue via-teal-dark to-light-teal p-12 overflow-hidden items-center justify-center shadow-2xl order-1">
          <div className="absolute inset-0 bg-pure-white/10 backdrop-blur-3xl"></div>
          <div className="absolute top-10 left-10 w-40 h-40 bg-light-teal rounded-full mix-blend-overlay filter blur-[50px] opacity-70 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-dark-blue rounded-full mix-blend-overlay filter blur-[60px] opacity-60"></div>

          <div className="relative z-10 text-pure-white max-w-md text-left">
            <h2 className="text-5xl font-black mb-6 leading-tight drop-shadow-md">
              Bienvenido de <br /> nuevo a <br />
              <span className="text-light-teal drop-shadow-sm">Tu bienestar integral</span>
            </h2>
            <p className="text-base font-medium text-pure-white/80 leading-relaxed mb-8">
              Tu progreso te está esperando. Accede a tu panel para ver tus estadísticas y seguir conquistando tus metas de salud.
            </p>

            <div className="flex items-center gap-4 bg-pure-white/10 p-5 rounded-2xl backdrop-blur-md border border-pure-white/20 shadow-lg">
              <div className="bg-light-teal text-dark-blue p-3 rounded-full text-xl">🚀</div>
              <div>
                <p className="font-black text-sm tracking-wide">Resumen de Actividad</p>
                <p className="text-xs font-bold text-pure-white/70 uppercase tracking-widest mt-1">Sincronización lista</p>
              </div>
            </div>
          </div>
        </div>

        {/* CARD DEL FORMULARIO - Ahora está en orden 2 en Desktop (Derecha) */}
        <div className="w-full lg:w-[500px] flex-shrink-0 bg-pure-white z-10 p-8 sm:p-10 order-2 rounded-[2rem] shadow-[0_10px_40px_rgba(187,230,228,0.4)] border border-light-teal/50 flex flex-col justify-center">
          
          <div className="mb-8 text-center sm:text-left">
            <h3 className="text-4xl font-black text-dark-blue mb-3">Inicia Sesión</h3>
            <p className="text-dark-blue/70 font-medium text-base">Ingresa tus credenciales para continuar.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Input Correo */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-black uppercase tracking-widest text-dark-blue/70 ml-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="tu@correo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 border-2 ${errors.email ? 'border-red-400' : 'border-slate-100'} focus:border-light-teal focus:bg-pure-white text-dark-blue px-4 py-4 rounded-2xl text-base font-bold outline-none transition-all placeholder:text-dark-blue/30`}
                />
                {errors.email && <p className="text-xs text-red-500 font-bold mt-1.5 ml-1 uppercase">{errors.email}</p>}
              </div>
            </div>

            {/* Input Contraseña */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-black uppercase tracking-widest text-dark-blue/70 ml-1">
                Contraseña
              </label>
              <div className={`relative flex items-center bg-slate-50 border-2 ${errors.password ? 'border-red-400' : 'border-slate-100'} focus-within:border-light-teal focus-within:bg-pure-white rounded-2xl transition-all pr-3`}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-transparent text-base font-bold text-dark-blue px-4 py-4 outline-none placeholder:text-dark-blue/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-dark-blue/40 hover:text-teal-dark p-2 transition-colors"
                  aria-label="Ver contraseña"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-bold mt-1.5 ml-1 uppercase">{errors.password}</p>}
            </div>

            {/* Opciones adicionales */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-light-teal/40 text-teal-dark focus:ring-teal-dark accent-teal-dark cursor-pointer transition-all" />
                <span className="text-sm font-medium text-dark-blue/70 group-hover:text-dark-blue transition-colors">Recordarme</span>
              </label>

              <Link to="/forgot-password" className="text-sm font-bold text-teal-dark hover:text-dark-blue hover:underline transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Alerta de Error del Servidor (Genérico) */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-base text-red-700 font-bold">{serverError}</p>
              </div>
            )}

            {/* Botón Ingresar */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 mt-6 rounded-2xl font-black uppercase tracking-widest text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                loading 
                  ? 'bg-teal-dark/50 text-pure-white/80 cursor-not-allowed' 
                  : 'bg-teal-dark text-pure-white hover:bg-dark-blue shadow-lg shadow-teal-dark/30 hover:shadow-dark-blue/30 hover:-translate-y-1'
              }`}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión →'}
            </button>
          </form>

          {/* Separador */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-black text-dark-blue/40 uppercase tracking-widest">o continúa con</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          {/* Botón Social ÚNICO (Google) */}
          <button className="flex w-full items-center justify-center gap-3 border-2 border-slate-100 bg-slate-50 py-4 rounded-2xl hover:bg-light-teal/10 hover:border-light-teal transition-all text-dark-blue font-bold text-base">
            <img src="https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/brand-logo/google-icon.png" alt="Google" className="w-6 h-6" />
            Continuar con Google
          </button>

          <p className="text-center mt-8 text-dark-blue/70 font-medium text-base">
            ¿No tienes una cuenta aún?{" "}
            <Link to="/register" className="text-teal-dark font-black hover:text-dark-blue transition-colors hover:underline underline-offset-4 decoration-2">
              Crea una cuenta nueva
            </Link>
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}
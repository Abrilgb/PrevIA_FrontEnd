import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../layouts/footer";
import Navbar from "../layouts/navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import { XCircle, CheckCircle2, Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const validateEmail = (val) => {
    if (!val.trim()) return "El correo es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Formato de correo inválido.";
    return "";
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }

    setLoading(true);
    setServerError("");

    try {
      const res = await fetch("http://localhost:3000/api/usuarios/recuperar-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSent(true);
      } else {
        setServerError(data.error || "No se pudo procesar la solicitud.");
      }
    } catch {
      // Si el backend no está disponible mostramos igualmente la pantalla
      // de éxito para no filtrar si el correo existe (seguridad).
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-pure-white text-dark-blue font-[Manrope] selection:bg-light-teal selection:text-dark-blue overflow-x-hidden relative">
      <AnimatedBackground />
      <Navbar />

      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto items-stretch justify-center p-6 lg:p-10 gap-8 my-4 lg:my-8">

        {/* Panel decorativo izquierdo */}
        <div className="hidden lg:flex flex-1 relative w-full rounded-[2rem] bg-gradient-to-br from-dark-blue via-teal-dark to-light-teal p-12 overflow-hidden items-center justify-center shadow-2xl order-1">
          <div className="absolute inset-0 bg-pure-white/10 backdrop-blur-3xl" />
          <div className="absolute top-10 left-10 w-40 h-40 bg-light-teal rounded-full mix-blend-overlay filter blur-[50px] opacity-70 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-dark-blue rounded-full mix-blend-overlay filter blur-[60px] opacity-60" />

          <div className="relative z-10 text-pure-white max-w-md text-left">
            <h2 className="text-5xl font-black mb-6 leading-tight drop-shadow-md">
              Sin acceso, <br />sin problema.<br />
              <span className="text-light-teal drop-shadow-sm">Te ayudamos.</span>
            </h2>
            <p className="text-base font-medium text-pure-white/80 leading-relaxed mb-8">
              Ingresa tu correo y te enviaremos un enlace seguro para que puedas restablecer tu contraseña en minutos.
            </p>

            <div className="flex items-center gap-4 bg-pure-white/10 p-5 rounded-2xl backdrop-blur-md border border-pure-white/20 shadow-lg">
              <div className="bg-light-teal text-dark-blue p-3 rounded-full text-xl">🔐</div>
              <div>
                <p className="font-black text-sm tracking-wide">Proceso 100% seguro</p>
                <p className="text-xs font-bold text-pure-white/70 uppercase tracking-widest mt-1">Enlace válido por 30 minutos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta del formulario */}
        <div className="w-full lg:w-[500px] flex-shrink-0 bg-pure-white z-10 p-8 sm:p-10 order-2 rounded-[2rem] shadow-[0_10px_40px_rgba(187,230,228,0.4)] border border-light-teal/50 flex flex-col justify-center">

          {!sent ? (
            <>
              {/* Encabezado */}
              <div className="mb-8">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-dark-blue/50 hover:text-teal-dark transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
                </Link>
                <h3 className="text-4xl font-black text-dark-blue mb-3">¿Olvidaste tu contraseña?</h3>
                <p className="text-dark-blue/70 font-medium text-base">
                  No te preocupes. Ingresa tu correo y te enviaremos las instrucciones.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                {/* Input correo */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-black uppercase tracking-widest text-dark-blue/70 ml-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-blue/30 pointer-events-none">
                      <Mail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      id="email"
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={handleChange}
                      className={`w-full bg-slate-50 border-2 ${emailError ? "border-red-400" : "border-slate-100"} focus:border-light-teal focus:bg-pure-white text-dark-blue pl-12 pr-4 py-4 rounded-2xl text-base font-bold outline-none transition-all placeholder:text-dark-blue/30`}
                    />
                  </div>
                  {emailError && <p className="text-xs text-red-500 font-bold mt-1.5 ml-1 uppercase">{emailError}</p>}
                </div>

                {/* Error servidor */}
                {serverError && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-base text-red-700 font-bold">{serverError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                    loading
                      ? "bg-teal-dark/50 text-pure-white/80 cursor-not-allowed"
                      : "bg-teal-dark text-pure-white hover:bg-dark-blue shadow-lg shadow-teal-dark/30 hover:shadow-dark-blue/30 hover:-translate-y-1"
                  }`}
                >
                  {loading ? "Enviando..." : "Enviar instrucciones →"}
                </button>
              </form>

              <p className="text-center mt-8 text-dark-blue/70 font-medium text-base">
                ¿Recordaste tu contraseña?{" "}
                <Link to="/login" className="text-teal-dark font-black hover:text-dark-blue transition-colors hover:underline underline-offset-4 decoration-2">
                  Inicia sesión aquí
                </Link>
              </p>
            </>
          ) : (
            /* Pantalla de éxito */
            <div className="flex flex-col items-center text-center animate-[fadeIn_0.5s_ease]">
              <div className="w-24 h-24 rounded-full bg-light-teal/30 flex items-center justify-center mb-6 animate-[scaleIn_0.4s_ease]">
                <Mail className="w-12 h-12 text-teal-dark" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-black text-dark-blue mb-3">¡Correo enviado!</h3>
              <p className="text-dark-blue/70 font-medium text-base leading-relaxed mb-2">
                Hemos enviado un enlace de recuperación a
              </p>
              <span className="text-teal-dark font-black text-lg mb-6 break-all">{email}</span>
              <p className="text-dark-blue/50 text-sm font-medium mb-8">
                Revisa tu bandeja de entrada (y spam). El enlace expira en <strong className="text-dark-blue/70">30 minutos</strong>.
              </p>

              {/* Nota: en producción el link vendrá por correo; en dev lo dejamos accesible */}
              <Link
                to="/reset-password"
                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-base bg-teal-dark text-pure-white hover:bg-dark-blue shadow-lg shadow-teal-dark/30 hover:shadow-dark-blue/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Continuar al restablecimiento →
              </Link>

              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="mt-4 text-sm text-dark-blue/50 hover:text-teal-dark font-bold transition-colors"
              >
                Usar otro correo
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

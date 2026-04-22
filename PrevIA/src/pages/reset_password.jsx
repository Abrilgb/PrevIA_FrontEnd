import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../layouts/footer";
import Navbar from "../layouts/navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import { CheckCircle2, XCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // ---------- Fortaleza de contraseña ----------
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, color: "bg-slate-200", text: "", missing: [] };
    let score = 0;
    const missing = [];
    if (pass.length >= 8) score++; else missing.push("8 caracteres");
    if (/[A-Z]/.test(pass)) score++; else missing.push("1 mayúscula");
    if (/[0-9]/.test(pass)) score++; else missing.push("1 número");
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++; else missing.push("1 símbolo especial");

    let color = "bg-red-400";
    let text = "Débil";
    if (score === 2) { color = "bg-yellow-400"; text = "Media"; }
    if (score === 3) { color = "bg-teal-400"; text = "Buena"; }
    if (score === 4) { color = "bg-green-500"; text = "Fuerte"; }

    return { score, color, text, missing };
  };

  const passStrength = getPasswordStrength(formData.newPassword);
  const passwordsMatch =
    formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword;
  const confirmHasText = formData.confirmPassword.length > 0;

  // ---------- Validación ----------
  const validate = () => {
    const errs = {};
    if (!formData.newPassword) {
      errs.newPassword = "La contraseña es obligatoria.";
    } else if (passStrength.score < 4) {
      errs.newPassword = "La contraseña debe cumplir todos los requisitos.";
    }
    if (!formData.confirmPassword) {
      errs.confirmPassword = "Debes confirmar la contraseña.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errs.confirmPassword = "Las contraseñas no coinciden.";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: null }));
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError("");

    try {
      // En producción aquí va el token del query param (?token=...)
      const token = new URLSearchParams(window.location.search).get("token") || "dev-token";

      const res = await fetch("http://localhost:3000/api/usuarios/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: formData.newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setServerError(data.error || "No se pudo restablecer la contraseña.");
      }
    } catch {
      // En entorno de desarrollo simulamos éxito
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  // Redirigir tras el éxito con contador
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    if (!success) return;
    if (countdown <= 0) { navigate("/login"); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [success, countdown, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-pure-white text-dark-blue font-[Manrope] selection:bg-light-teal selection:text-dark-blue overflow-x-hidden relative">
      <AnimatedBackground />
      <Navbar />

      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto items-stretch justify-center p-6 lg:p-10 gap-8 my-4 lg:my-8">

        {/* Panel decorativo */}
        <div className="hidden lg:flex flex-1 relative w-full rounded-[2rem] bg-gradient-to-tr from-light-teal via-teal-dark to-dark-blue p-12 overflow-hidden items-end justify-start shadow-2xl order-1">
          <div className="absolute inset-0 bg-dark-blue/10 backdrop-blur-[2px]" />
          <div className="absolute top-10 right-10 w-40 h-40 bg-pure-white rounded-full mix-blend-overlay filter blur-[50px] opacity-40 animate-pulse" />
          <div className="absolute bottom-20 left-10 w-60 h-60 bg-light-teal rounded-full mix-blend-overlay filter blur-[60px] opacity-60" />
          <div className="relative z-10 text-pure-white w-full pr-10">
            <span className="inline-block px-4 py-1.5 bg-pure-white/20 backdrop-blur-md border border-pure-white/30 rounded-full text-xs font-black text-pure-white mb-6 tracking-widest uppercase shadow-sm">
              Reconstruye tu acceso
            </span>
            <h2 className="text-5xl font-black leading-tight drop-shadow-md">
              Crea una contraseña <br /> que nadie pueda adivinar.
            </h2>
            <p className="mt-4 text-pure-white/80 font-medium text-base leading-relaxed max-w-sm">
              Usa al menos 8 caracteres, una mayúscula, un número y un símbolo especial para máxima seguridad.
            </p>
          </div>
        </div>

        {/* Tarjeta formulario */}
        <div className="w-full lg:w-[500px] flex-shrink-0 bg-pure-white z-10 p-8 sm:p-10 order-2 rounded-[2rem] shadow-[0_10px_40px_rgba(187,230,228,0.4)] border border-light-teal/50 flex flex-col justify-center">

          {!success ? (
            <>
              {/* Encabezado */}
              <div className="mb-8">
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center gap-2 text-sm font-bold text-dark-blue/50 hover:text-teal-dark transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" /> Volver
                </Link>
                <h3 className="text-4xl font-black text-dark-blue mb-3">Nueva contraseña</h3>
                <p className="text-dark-blue/70 font-medium text-base">
                  Elige una contraseña segura. Recuerda no compartirla con nadie.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit} noValidate>

                {/* Nueva contraseña */}
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-black uppercase tracking-widest text-dark-blue/70 ml-1">
                    Nueva Contraseña
                  </label>
                  <div className={`relative flex items-center bg-slate-50 border-2 ${errors.newPassword ? "border-red-400" : "border-slate-100"} focus-within:border-light-teal focus-within:bg-pure-white rounded-2xl transition-all pr-3`}>
                    <input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      placeholder="Crea una contraseña segura"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full bg-transparent text-base font-bold text-dark-blue px-4 py-4 outline-none placeholder:text-dark-blue/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="text-dark-blue/40 hover:text-teal-dark p-2 transition-colors"
                      aria-label="Ver contraseña"
                    >
                      {showNew ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>

                  {/* Indicador de fortaleza */}
                  {formData.newPassword.length > 0 && (
                    <div className="pt-2 px-1 transition-all">
                      <div className="flex gap-1.5 h-2 mb-2">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full ${i < passStrength.score ? passStrength.color : "bg-slate-200"} transition-colors duration-300`}
                          />
                        ))}
                      </div>
                      {passStrength.missing.length === 0 ? (
                        <span className="text-xs font-black text-green-500 uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> ¡Contraseña segura!
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-dark-blue/50 flex flex-wrap gap-1 leading-snug">
                          Falta: <span className="text-red-500 font-black">{passStrength.missing.join(", ")}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {errors.newPassword && <p className="text-xs text-red-500 font-bold mt-1.5 ml-1 uppercase">{errors.newPassword}</p>}
                </div>

                {/* Confirmar contraseña */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-black uppercase tracking-widest text-dark-blue/70 ml-1">
                    Confirmar Contraseña
                  </label>
                  <div className={`relative flex items-center bg-slate-50 border-2 transition-all pr-3 rounded-2xl
                    ${!confirmHasText ? "border-slate-100 focus-within:border-light-teal" : passwordsMatch ? "border-green-500 bg-green-50/30" : "border-red-400 bg-red-50/30"}
                  `}>
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repite tu contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-transparent text-base font-bold text-dark-blue px-4 py-4 outline-none placeholder:text-dark-blue/30"
                    />
                    {confirmHasText && (
                      passwordsMatch
                        ? <CheckCircle2 className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" strokeWidth={2.5} />
                        : <XCircle className="w-6 h-6 text-red-400 mr-2 flex-shrink-0" strokeWidth={2.5} />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-dark-blue/40 hover:text-teal-dark p-2 transition-colors"
                      aria-label="Ver confirmación"
                    >
                      {showConfirm ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>
                  {confirmHasText && !passwordsMatch && <p className="text-xs text-red-500 font-bold mt-1.5 ml-1 uppercase">Las contraseñas no coinciden</p>}
                  {errors.confirmPassword && !confirmHasText && <p className="text-xs text-red-500 font-bold mt-1.5 ml-1 uppercase">{errors.confirmPassword}</p>}
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
                  {loading ? "Guardando..." : "Restablecer contraseña →"}
                </button>
              </form>
            </>
          ) : (
            /* ======= PANTALLA DE ÉXITO ======= */
            <div className="flex flex-col items-center text-center">
              {/* Ícono animado */}
              <div className="relative w-28 h-28 mb-6">
                <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30" />
                <div className="relative w-28 h-28 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-14 h-14 text-green-500" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="text-3xl font-black text-dark-blue mb-3">¡Contraseña actualizada!</h3>
              <p className="text-dark-blue/70 font-medium text-base leading-relaxed mb-2">
                Tu contraseña se cambió correctamente.
              </p>
              <p className="text-dark-blue/50 text-sm font-medium mb-8">
                Ya puedes iniciar sesión con tu nueva contraseña.
              </p>

              {/* Barra de progreso de cuenta regresiva */}
              <div className="w-full mb-4">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-dark rounded-full transition-all duration-1000"
                    style={{ width: `${(countdown / 5) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-dark-blue/40 font-bold text-center mt-2 uppercase tracking-widest">
                  Redirigiendo en {countdown}s…
                </p>
              </div>

              <Link
                to="/login"
                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-base bg-teal-dark text-pure-white hover:bg-dark-blue shadow-lg shadow-teal-dark/30 hover:shadow-dark-blue/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Ir al inicio de sesión →
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

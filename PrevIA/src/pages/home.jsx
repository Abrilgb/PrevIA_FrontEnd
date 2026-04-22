import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../layouts/footer";
import Navbar from "../layouts/navbar";
import logo from "../assets/PrevIa.png";

export default function LandingPage() {
    return (
        <div className="bg-pure-white text-pure-black font-[Manrope] min-h-screen selection:bg-light-teal selection:text-dark-blue">
            <Navbar />

            {/* HERO SECTION */}
            <section className="px-6 relative lg:px-20 py-16 lg:py-28 overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-light-teal opacity-20 blur-3xl"></div>
                <div className="absolute top-20 left-0 -ml-40 w-72 h-72 rounded-full bg-teal-dark opacity-10 blur-3xl"></div>

                <div className="max-w-7xl relative mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-light-teal to-pure-white text-dark-blue border border-light-teal shadow-sm text-xs font-bold mb-8 transition hover:shadow-md">
                            <img src={logo} alt="PrevIa" className="w-5 h-5 rounded-md" />
                            Nueva versión 2.0 disponible
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 text-dark-blue">
                            Tu salud, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-dark to-dark-blue">
                                bajo control
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-dark-blue/70 mb-10 max-w-lg leading-relaxed">
                            Monitorea tu actividad, nutrición y descanso en un solo lugar con
                            tecnología de vanguardia y diseño inteligente.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register">
                                <button className="bg-dark-blue text-pure-white px-8 py-4 rounded-xl font-bold tracking-wide shadow-lg shadow-dark-blue/30 hover:shadow-dark-blue/50 hover:-translate-y-1 transition-all duration-300">
                                    Empieza gratis →
                                </button>
                            </Link>

                            <button className="bg-transparent border-2 border-dark-blue/20 text-dark-blue px-8 py-4 rounded-xl font-bold tracking-wide hover:border-dark-blue hover:bg-dark-blue/5 transition-all duration-300">
                                Ver demo
                            </button>
                        </div>
                    </div>

                    {/* HERO IMAGE */}
                    <div className="relative group z-10 w-full mt-10 lg:mt-0">
                        {/* Animated border glow */}
                        <div className="absolute -inset-1 bg-gradient-to-tr from-light-teal via-teal-dark to-dark-blue rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>

                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-pure-white">
                            <img
                                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4BF5AdcFfWRoTbXHr5HB46H-Hij7jLzdZubmbMrC8NNET5PuTcF3ciIrsOrYXy-GN6FaTjMpdfskuShs2y3n-uLpqgAG3r9KWT-ELUsFTy0mZUpjvzWbEd5Vp2TIRP7zx9pg438ezItXY4Gog7UXf78pJ81r2pyVz7gQpxeGDb0v5qprIHEIhaiBnKK6Lx127ucfg6hjonS3kJY07_mJ251uCJXcHD6466A5HdbGh5OPq8hQ8AZ0TdLfXH1ybO12khzgHjgX_usGw"
                                alt="PrevIA App Preview"
                            />

                            {/* Glassmorphism glass overlay detail */}
                            <div className="absolute bottom-4 left-4 right-4 bg-pure-white/80 backdrop-blur-md border border-pure-white/50 p-4 rounded-2xl shadow-lg flex items-center gap-4">
                                <div className="bg-light-teal text-teal-dark p-3 rounded-full">
                                    ❤️
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-dark-blue">Salud Óptima</p>
                                    <p className="text-xs text-dark-blue/60">Datos sincronizados hoy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="px-6 lg:px-20 py-24 bg-gradient-to-b from-pure-white to-light-teal/10 relative">
                <div className="max-w-7xl mx-auto">
                    {/* Section Heading */}
                    <div className="text-center mb-20 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 text-dark-blue leading-tight">
                            Todo lo que necesitas para tu bienestar
                        </h2>
                        <p className="text-dark-blue/70 text-lg">
                            Herramientas diseñadas por expertos analizando tus datos en tiempo real para alcanzar tus metas de salud.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-10 rounded-3xl bg-pure-white border border-light-teal/40 shadow-xl shadow-light-teal/10 hover:shadow-2xl hover:shadow-teal-dark/10 hover:-translate-y-2 transition-all duration-300 group">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-light-teal to-light-teal/30 text-teal-dark flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">📈</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-dark-blue">
                                Activity tracking
                            </h3>
                            <p className="text-dark-blue/70 leading-relaxed">
                                Registra cada paso y entrenamiento con precisión GPS. Visualiza tu progreso con gráficas detalladas.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-10 rounded-3xl bg-pure-white border border-light-teal/40 shadow-xl shadow-light-teal/10 hover:shadow-2xl hover:shadow-teal-dark/10 hover:-translate-y-2 transition-all duration-300 group">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-light-teal to-light-teal/30 text-teal-dark flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🍎</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-dark-blue">
                                Nutrition planning
                            </h3>
                            <p className="text-dark-blue/70 leading-relaxed">
                                Planes de alimentación personalizados adaptados a tu salud, con recetas e información nutrimental.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-10 rounded-3xl bg-pure-white border border-light-teal/40 shadow-xl shadow-light-teal/10 hover:shadow-2xl hover:shadow-teal-dark/10 hover:-translate-y-2 transition-all duration-300 group">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-light-teal to-light-teal/30 text-teal-dark flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🌙</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-dark-blue">
                                Sleep analysis
                            </h3>
                            <p className="text-dark-blue/70 leading-relaxed">
                                Analiza tus ciclos de sueño y recibe recomendaciones para mejorar tu recuperación y descanso.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="px-6 lg:px-20 py-24 bg-pure-white">
                <div className="max-w-5xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-dark-blue via-teal-dark to-light-teal rounded-[3rem] blur-xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>

                    <div className="relative bg-dark-blue bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-soft-light text-pure-white rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden border border-teal-dark/50 shadow-2xl">
                        {/* Glowing orbs */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-dark opacity-40 blur-[80px]"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-light-teal opacity-20 blur-[80px]"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 text-pure-white leading-tight">
                                ¿Listo para transformar tu vida?
                            </h2>

                            <p className="text-light-teal text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                                Únete a más de 10,000 personas que ya mejoran su salud cada día.
                            </p>
                            <Link to="/register">
                                <button className="bg-light-teal text-dark-blue px-10 py-4 md:px-12 md:py-5 rounded-2xl font-black text-lg shadow-xl shadow-black/20 hover:bg-pure-white hover:scale-105 hover:shadow-light-teal/30 transition-all duration-300">
                                    Empieza gratis ahora
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
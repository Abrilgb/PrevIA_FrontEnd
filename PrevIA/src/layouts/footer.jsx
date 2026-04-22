import logo from "../assets/PrevIa.png";

export default function Footer() {
  return (
    <footer className="bg-dark-blue text-light-teal/80 border-t border-teal-dark/30 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-dark rounded-full mix-blend-screen filter blur-[100px] opacity-20 translate-y-1/2 translate-x-1/3"></div>

      <div className="footer sm:footer-horizontal p-10 lg:p-16 max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 relative z-10">
        <aside className="space-y-4 max-w-xs">
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="PrevIa Logo" className="w-10 h-10 rounded-xl shadow-sm object-cover" />
            <span className="text-3xl font-black text-pure-white tracking-tighter">PrevIA</span>
          </div>
          <p className="text-sm leading-relaxed">
            Tu plataforma inteligente para el monitoreo de salud. Controla tu actividad física, nutrición y descanso en un solo ecosistema integrado.
          </p>
        </aside>

        <nav className="space-y-3">
          <h6 className="footer-title text-pure-white uppercase tracking-widest text-xs opacity-100 mb-4 border-b border-light-teal/20 pb-2">Plataforma</h6>
          <a className="link link-hover hover:text-pure-white transition-colors duration-200">Panel de Salud</a>
          <a className="link link-hover hover:text-pure-white transition-colors duration-200">Nutrición</a>
          <a className="link link-hover hover:text-pure-white transition-colors duration-200">Seguimiento de Sueño</a>
          <a className="link link-hover hover:text-pure-white transition-colors duration-200">Actividad Física</a>
        </nav>

        <nav className="space-y-3">
          <h6 className="footer-title text-pure-white uppercase tracking-widest text-xs opacity-100 mb-4 border-b border-light-teal/20 pb-2">Compañía</h6>
          <a className="link link-hover hover:text-pure-white transition-colors duration-200">Sobre nosotros</a>
          <a className="link link-hover hover:text-pure-white transition-colors duration-200">Contacto</a>
          <a className="link link-hover hover:text-pure-white transition-colors duration-200">Oportunidades</a>
          <a className="link link-hover hover:text-pure-white transition-colors duration-200">Prensa</a>
        </nav>

        <form className="max-w-md">
          <h6 className="footer-title text-pure-white uppercase tracking-widest text-xs opacity-100 mb-4">Boletín Exclusivo</h6>
          <p className="text-sm mb-4">Recibe las últimas actualizaciones y consejos de salud.</p>
          <fieldset className="w-full">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="tu@correo.com"
                className="input bg-pure-white/5 border border-light-teal/20 text-pure-white placeholder:text-light-teal/40 focus:border-light-teal focus:outline-none focus:ring-1 focus:ring-light-teal rounded-xl w-full" />
              <button className="bg-light-teal text-dark-blue px-6 py-3 rounded-xl font-bold hover:bg-pure-white hover:shadow-lg hover:shadow-light-teal/20 transition-all duration-300 whitespace-nowrap">
                Suscribirse
              </button>
            </div>
          </fieldset>
        </form>
      </div>

      <div className="border-t border-light-teal/10 p-6 text-center text-xs text-light-teal/60">
        <p>© {new Date().getFullYear()} PrevIA Inc. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
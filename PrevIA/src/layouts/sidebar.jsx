import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./navbar";
import Footer from "./footer";
import AICoach from "../components/AICoach";
import logo from "../assets/PrevIa.png";

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname;

  // Cierra el sidebar automáticamente en pantallas pequeñas al cambiar de ruta
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [currentPath]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
    },
    {
      path: "/perfil",
      label: "Perfil",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      path: "/sleep",
      label: "Sueño",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ),
    },
    {
      path: "/nutricion",
      label: "Nutrición",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
          <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ),
    },
    {
      path: "/walk",
      label: "Actividad Física",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M13 4v16" /><path d="M17 4v16" /><path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
        </svg>
      ),
    },
    {
      path: "/bienestar",
      label: "Bienestar",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
        </svg>
      ),
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-[Manrope] flex flex-col transition-colors duration-300">
      {/* Sidebar Overlay (Mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-blue/20 dark:bg-slate-950/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div className="flex flex-1 relative">
        {/* Sidebar Aside */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-pure-white dark:bg-slate-900 border-r border-light-teal/30 dark:border-slate-800 text-dark-blue dark:text-pure-white transition-all duration-300 transform
            ${isOpen ? "translate-x-0 w-70 lg:w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"}`}
        >
          {/* Logo Section */}
          <div className="flex items-center justify-center lg:justify-start gap-3 px-6 py-6 border-b border-light-teal/20 dark:border-slate-800 min-h-[80px]">
            <img src={logo} alt="PrevIa Logo" className="w-10 h-10 rounded-xl shadow-sm object-cover" />
            <span className={`text-2xl font-black text-dark-blue dark:text-pure-white tracking-tighter transition-opacity duration-300 ${!isOpen && "hidden lg:opacity-0 lg:pointer-events-none"}`}>
              PrevIA
            </span>
          </div>

          {/* Sidebar Links - SCROLLBAR OCULTO AQUÍ */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all duration-200 group relative cursor-pointer
                      ${isActive
                          ? "bg-teal-dark text-pure-white shadow-lg shadow-teal-dark/20"
                          : "text-dark-blue/70 dark:text-pure-white/70 hover:bg-light-teal/10 dark:hover:bg-slate-800 hover:text-teal-dark dark:hover:text-light-teal"
                        }`}
                    >
                      <span className={`${isActive ? "text-pure-white" : "text-teal-dark dark:text-light-teal group-hover:scale-110"} transition-transform shrink-0 pointer-events-none`}>
                        {item.icon}
                      </span>
                      <span className={`whitespace-nowrap transition-all duration-300 pointer-events-none
                      ${!isOpen && "lg:opacity-0 lg:w-0 lg:overflow-hidden lg:ml-0"}`}
                      >
                        {item.label}
                      </span>
                      {!isOpen && (
                        <div className="absolute left-full ml-4 px-3 py-1 bg-dark-blue dark:bg-slate-800 text-pure-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden lg:block z-50 whitespace-nowrap">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer (Settings) */}
          <div className="p-4 border-t border-light-teal/20 dark:border-slate-800">
            <Link
              to="/configuracion"
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all duration-200 group relative cursor-pointer
              ${currentPath === "/configuracion"
                  ? "bg-teal-dark text-pure-white shadow-lg shadow-teal-dark/20"
                  : "text-dark-blue/70 dark:text-pure-white/70 hover:bg-light-teal/10 dark:hover:bg-slate-800 hover:text-teal-dark dark:hover:text-light-teal"
                }`}
            >
              <span className={`${currentPath === "/configuracion" ? "text-pure-white" : "text-teal-dark dark:text-light-teal group-hover:rotate-45"} transition-transform shrink-0 pointer-events-none`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </span>
              <span className={`whitespace-nowrap transition-all duration-300 pointer-events-none
              ${!isOpen && "lg:opacity-0 lg:w-0 lg:overflow-hidden lg:ml-0"}`}
              >
                Configuración
              </span>
              {!isOpen && (
                <div className="absolute left-full ml-4 px-3 py-1 bg-dark-blue dark:bg-slate-800 text-pure-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden lg:block z-50 whitespace-nowrap">
                  Configuración
                </div>
              )}
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isOpen ? "lg:ml-64" : "lg:ml-20"}`}>
          {/* El Navbar va a mostrar tu botón "MENÚ" y el nombre redundante. Te sugiero ir al componente Navbar.jsx y borrar la etiqueta que dice "PrevIA" o el <img src={logo}> que tengas ahí adentro. */}
          <Navbar onToggle={toggleSidebar} isSidebarOpen={isOpen} isDashboard={true} />
          
          <AnimatePresence mode="wait">
            <motion.main
              key={currentPath}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)', transition: { duration: 0.2, ease: [0.55, 0.06, 0.68, 0.19] } }}
              // APLICAMOS SCROLLBAR OCULTO AL MAIN CONTENT TAMBIÉN
              className="flex-1 p-4 lg:p-10 transition-colors duration-300 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {children}
            </motion.main>
          </AnimatePresence>
          <Footer />
        </div>
      </div>
      
      {/* Tu AICoach global */}
      <AICoach />
    </div>
  );
}